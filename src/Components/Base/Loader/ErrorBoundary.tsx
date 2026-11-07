// React
import { Component } from "react";
import type { ComponentType, ErrorInfo, ReactNode } from "react";

// Third Party
import { withTranslation } from "react-i18next";
import type { WithTranslation } from "react-i18next";

// AA Geuthur React
import { ErrorLoader } from "@/Components/Base/Loader/ErrorLoader";
import { I18N_NAMESPACE } from "@/i18n";

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Extra classes for the `<pre>` with the component stack. */
  traceClassName?: string;
}

type Props = ErrorBoundaryProps & WithTranslation;

interface State {
  hasError: boolean;
  title?: string;
  message?: string;
  trace?: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      message: "",
      trace: "",
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error: ", error, errorInfo);
    this.setState({
      hasError: true,
      title: error.name,
      message: error.message,
      trace: String(errorInfo.componentStack),
    });
  }

  render() {
    if (this.state.hasError) {
      const { t, traceClassName = "" } = this.props;
      return (
        <>
          <ErrorLoader title={this.state.title} message={this.state.message} />
          <h1>{t("Something went wrong.")}</h1>
          <div className="d-flex justify-content-center">
            <pre className={`border mw-100 overflow-auto p-2 ${traceClassName}`} data-testid="error-boundary-trace">
              {this.state.trace}
            </pre>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

/** Catches render errors of its children and shows the error with the component stack. */
const TranslatedErrorBoundary: ComponentType<ErrorBoundaryProps> = withTranslation(I18N_NAMESPACE)(ErrorBoundary);

export default TranslatedErrorBoundary;
