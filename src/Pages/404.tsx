// Third Party
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// AA Geuthur React
import { ErrorLoader } from '@/Components/Base/Loader';
import { I18N_NAMESPACE } from "@/i18n";
export function ErrorPage() {
    const { t } = useTranslation(I18N_NAMESPACE);
    return (
        <Card>
            <Card.Body className="p-0">
                <ErrorLoader title={t("Error 404")} message={t("The page you are looking for does not exist.")} />
            </Card.Body>
        </Card>
    );
}
