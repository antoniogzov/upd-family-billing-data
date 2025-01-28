
<?php

use App\Models\DataConn;
use App\Config\IPS;

$path_instraschool = dirname(__FILE__, 5);
include_once $path_instraschool . "/vendor/autoload.php";

$conn = new DataConn();
$conexion = $conn->dbConn();


include 'model.php';

include_once 'vendor/phpmailer/phpmailer/src/PHPMailer.php';
include_once 'vendor/phpmailer/phpmailer/src/Exception.php';
include_once 'vendor/phpmailer/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

date_default_timezone_set('America/Mexico_City');
session_start();

if (isset($_POST['func'])) {
    $func = $_POST['func'];
    $func();
}

function getBillingTypes()
{
    $billingTypes = array();
    if (isset($_SESSION['family_code'])) {


        $appointments = new BillingData;
        $billingTypes = $appointments->getBillingTypes($_SESSION['family_code']);
    } else if (isset($_POST['family_code'])) {
        $appointments = new BillingData;
        $billingTypes = $appointments->getBillingTypes($_POST['family_code']);
    }

    /* $appointments = new BillingData;
    $codigo_familia = 'AB56';
    $billingTypes = $appointments->getStudents($codigo_familia);
 */
    echo json_encode($billingTypes);
}

function getCurrentBillingType()
{
    $billingTypes = array();
    if (isset($_SESSION['family_code'])) {

        $appointments = new BillingData;
        $billingTypes = $appointments->getCurrentBillingType($_SESSION['family_code']);
    } else if (isset($_POST['family_code'])) {
        $appointments = new BillingData;
        $billingTypes = $appointments->getCurrentBillingType($_POST['family_code']);
    }

    /* $appointments = new BillingData;
    $codigo_familia = 'AB56';
    $billingTypes = $appointments->getStudents($codigo_familia);
 */
    echo json_encode($billingTypes);
}

function getFamilyBillingData()
{
    $billingTypes = array();
    if (isset($_SESSION['family_code'])) {
        $id_billing_type = $_POST['id_billing_type'];

        $appointments = new BillingData;
        $billingTypes = $appointments->getFamilyBillingData($_SESSION['family_code'], $id_billing_type);
    }
    /* $appointments = new BillingData;
    $codigo_familia = 'AB56';
    $billingTypes = $appointments->getStudents($codigo_familia);
 */
    echo json_encode($billingTypes);
}

function getMunicipalitiesByState()
{
    $Municipalities = array();
    if (isset($_SESSION['family_code'])) {
        $id_state = $_POST['id_state'];

        $appointments = new BillingData;
        $Municipalities = $appointments->getMunicipalitiesByState($id_state);
    }
    /* $appointments = new BillingData;
    $codigo_familia = 'AB56';
    $Municipalities = $appointments->getStudents($codigo_familia);
 */
    echo json_encode($Municipalities);
}


function saveBillingData()
{
    $response = array("success" => false, "message" => "Ocurrió un error.");
    if (isset($_SESSION['family_code'])) {
        $family_code = $_SESSION['family_code'];
        $data = $_POST;

        $billing = new BillingData;
        // Verificar si se envió un archivo
        if ($_POST['idBillingType'] != 1) {
            if (($_POST['urlFiscalDoc']) == '') {
                if (isset($_FILES['docConstancia']) && $_FILES['docConstancia']['error'] === UPLOAD_ERR_OK) {
                    $file = $_FILES['docConstancia'];

                    // Validar tipo y tamaño del archivo
                    $allowedTypes = ['application/pdf'];
                    if (!in_array($file['type'], $allowedTypes)) {
                        $response["message"] = "El archivo debe ser un PDF.";
                        echo json_encode($response);
                        return;
                    }

                    if ($file['size'] > 2 * 1024 * 1024) { // Máximo 2 MB
                        $response["message"] = "El archivo excede el tamaño permitido de 2 MB.";
                        echo json_encode($response);
                        return;
                    }

                    // Generar un nombre personalizado para el archivo
                    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
                    $newFileName = $family_code . '_constancia_' . date('Ymd_His') . '.' . $extension;

                    // Directorio de carga
                    $uploadDir = dirname(__DIR__, 4) . '/billing/public/uploads/families_docs/' . $family_code . '/constancias_fiscales/'; // Cambia esta ruta según tu estructura
                    if (!file_exists($uploadDir)) {
                        
                        mkdir($uploadDir, 0755, true);
                    }
                    $bd_route = '/intraschool/billing/public/uploads/families_docs/' . $family_code . '/constancias_fiscales/' . $newFileName;; // Cambia esta ruta según tu estructura
                    // Guardar el archivo con el nombre personalizado
                    $filePath = $uploadDir . $newFileName;

                    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
                        $response["message"] = "No se pudo guardar el archivo.";
                        echo json_encode($response);
                        return;
                    }
                    // Agregar la ruta del archivo a los datos
                    $data['docConstanciaPath'] = $bd_route;
                } else {
                    $response["message"] = "No se recibió un archivo válido.";
                    echo json_encode($response);
                    return;
                }
            } else {
                $data['docConstanciaPath'] = $_POST['urlFiscalDoc'];
            }
        } else {
            $data['docConstanciaPath'] = NULL;
        }
        try {
            $result = $billing->saveOrUpdateBillingData($family_code, $data);
            if ($result) {
                $response["success"] = true;
                $response["message"] = "Datos de facturación guardados correctamente.";
            } else {
                $response["message"] = "No se pudo guardar los datos de facturación.";
            }
        } catch (Exception $e) {
            $response["message"] = "Error: " . $e->getMessage();
        }
    } else {
        $response["message"] = "No se encontró una sesión válida.";
    }

    echo json_encode($response);
}

function deleteFiscalDocument()
{
    $response = array("success" => false, "message" => "Ocurrió un error.");
    if (isset($_SESSION['family_code'])) {
        $family_code = $_SESSION['family_code'];
        $data = $_POST;
        $billing = new BillingData;
        try {
            $result = $billing->getAndDeleteURLFiscalDoc($family_code, $data);
            if ($result) {
                $urlDoc = $result->url_fiscal_doc;

                if (!empty($urlDoc)) {
                    // Convertir la URL en una ruta física absoluta
                    $filePath = $_SERVER['DOCUMENT_ROOT'] . $urlDoc;

                    // Verificar si el archivo existe antes de intentar eliminarlo
                    if (file_exists($filePath)) {
                        if (unlink($filePath)) {
                            //echo "El archivo ha sido eliminado: " . $filePath;
                        } else {
                            echo "Error al intentar eliminar el archivo: " . $filePath;
                        }
                    } else {
                        echo "El archivo no existe en la ruta especificada: " . $filePath;
                    }
                } else {
                    echo "La URL del documento está vacía o no es válida.";
                }

                $response["success"] = true;
                $response["message"] = "Documento eliminado correctamente.";
            } else {
                $response["message"] = "No se pudo eliminar el documento.";
            }
        } catch (Exception $e) {
            $response["message"] = "Error: " . $e->getMessage();
        }
    } else {
        $response["message"] = "No se encontró una sesión válida.";
    }

    echo json_encode($response);
}
