<?php
session_start();

use App\Models\DataConn;
use App\Config\IPS;

$path_instraschool = dirname(__FILE__, 4);
include_once $path_instraschool . "/vendor/autoload.php";
include_once 'php/model.php';
$conn = new DataConn();
$conexion = $conn->dbConn();

if (isset($_SESSION['family_code'])) {
    $codigo_familia = $_SESSION['family_code'];
    $familia = $_SESSION['family_name'];

    $model_billing = new BillingData();
    $states = $model_billing->getStates();
    $tax_regimes = $model_billing->getTaxRegimes();
    $cfdi_uses = $model_billing->getCFDI_Uses();
    $tax_object = $model_billing->getTaxObject();
} else {
    /* header('Location: /wykt/externo');
    die(); */
}
/*$codigo_familia = 'AB56';
$familia = 'CHAYO ZONANA';*/
include 'php/head_beginning.php';
include 'php/end_head_start_body.php';
include 'php/navbar.php';
include 'php/container_start.php';
?>
<script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<div class="row">
    <?php
    $module_name = 'Actualizar datos de facturación';
    include 'php/navigation_info.php';
    ?>
    <div id="blog-listing" class="col-lg-12">
        <div class="post">
            <h2>Actualizar datos de facturación <br /> <?= $codigo_familia ?> | <?= strtoupper($familia) ?></h2>
            <hr>
            <div class="row">
                <div class="col-md-12 col-lg-12">
                    <div class="form-group">
                        <label for="name">Elija un tipo de facturación: *</label>
                        <select class="form-control" id="slct-billing-types">
                            <option disabled selected value="">Elija una opción</option>
                        </select>
                    </div>
                </div>

                <div class="container mt-5">
                    <h2 class="text-center">Datos de Facturación</h2>
                    <form>
                        <div class="form-row">
                            <!-- RFC -->
                            <div class="form-group col-md-6">
                                <label for="rfc">RFC</label>
                                <input type="text" class="form-control" id="rfc" placeholder="RFC" maxlength="13" required>
                                <small class="form-text text-muted">El RFC debe contener 12 caracteres para personas morales y 13 para físicas.</small>
                            </div>

                            <!-- Razón social -->
                            <div class="form-group col-md-6">
                                <label for="bussiness_name">Razón Social</label>
                                <input type="text" class="form-control" id="bussiness_name" placeholder="Nombre de la empresa o persona física" required>
                            </div>
                        </div>


                        <!-- Dirección: Calle -->
                        <div class="form-group">
                            <label for="street">Calle</label>
                            <input type="text" class="form-control" id="street" placeholder="Ejemplo: Av. Insurgentes" required>
                        </div>

                        <!-- Dirección: Número exterior e interior -->
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="ext_num">Número Exterior</label>
                                <input type="text" class="form-control optional-input" id="ext_num" placeholder="Número Exterior">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="int_num">Número Interior (Opcional)</label>
                                <input type="text" class="form-control optional-input" id="int_num" placeholder="Número Interior">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="between_streets">Entre calles</label>
                            <input type="text" class="form-control optional-input" id="between_streets" placeholder="Entre calles">
                        </div>

                        <!-- Dirección: Colonia -->
                        <div class="form-group">
                            <label for="colony">Colonia</label>
                            <input type="text" class="form-control" id="colony" placeholder="Ejemplo: Col. Centro" required>
                        </div>

                        <!-- Dirección: Estado y País -->
                        <div class="form-row">

                            <div class="form-group col-md-6">
                                <label for="country">País</label>
                                <input type="text" class="form-control" id="country" value="México" disabled required>
                            </div>
                            <div class="form-group col-md-6">
                                <label for="slct-state">Estado</label>
                                <select class="form-control" id="slct-state" required>
                                    <option value="" selected disabled>Seleccione una opción</option>
                                    <?php foreach ($states as $state): ?>
                                        <option value="<?= $state->id ?>"><?= $state->estado ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <!-- Dirección: Municipio/Alcaldía -->
                            <div class="form-group col-md-6">
                                <label for="slct-municipality">Municipio/Alcaldía</label>
                                <select class="form-control" id="slct-municipality" disabled required>
                                    <option value="" selected disabled>Seleccione una opción</option>
                                </select>
                            </div>

                            <!-- Código postal -->
                            <div class="form-group col-md-6">
                                <label for="zip_code">Código Postal</label>
                                <input type="text" class="form-control" id="zip_code" placeholder="Ejemplo: 12345" maxlength="5" required>
                            </div>
                        </div>

                        <!-- Regimen Fiscal -->
                        <div class="form-group">
                            <label for="tax_reg">Regimen Fiscal</label>
                            <select class="form-control" id="tax_reg" required>
                                <option value="" selected disabled>Seleccione una opción</option>
                                <?php foreach ($tax_regimes as $tax): ?>
                                    <option value="<?= $tax->id_tax_regimes ?>"><?= $tax->code_tax_regimes ?> - <?= $tax->description ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <!-- Uso del CFDI -->
                        <div class="form-group">
                            <label for="cfdi_use">Uso del CFDI</label>
                            <select class="form-control" id="cfdi_use" required>
                                <option value="" selected disabled>Seleccione una opción</option>
                                <?php foreach ($cfdi_uses as $cfdi): ?>
                                    <option value="<?= $cfdi->id_cfdi_uses ?>"><?= $cfdi->code_cfdi ?> - <?= $cfdi->description ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <!-- Objeto impuesto -->

                        <!--  <div class="form-group">
                            <label for="tax_object">Objeto impuesto</label>
                            <select class="form-control" id="tax_object" required>
                                <option value="" selected disabled>Seleccione una opción</option>
                                <?php foreach ($tax_object as $tax_obj): ?>
                                    <option value="<?= $tax_obj->id_tax_object ?>"><?= $tax_obj->code_tax_object ?> - <?= $tax_obj->description ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div> -->

                        <!-- Correo electrónico -->
                        <div class="form-group">
                            <label for="mail">Correo Electrónico</label>
                            <input type="email" class="form-control" id="mail" placeholder="correo@ejemplo.com" required>
                        </div>

                        <div class="form-group custom-file-upload">
                            <label for="docConstanciaFiscal" class="form-label">Constancia de situación fiscal (PDF)</label>
                            <div class="file-input-container">
                                <input type="file" class="form-control-file" id="docConstanciaFiscal" data-status="0">
                                <span class="file-label" id="spanFile">Seleccionar archivo...</span>
                            </div>
                        </div>
                        <div id="viewFiscalDocContainer" style="margin-top: 10px;">
                            <a href="#" id="viewFiscalDoc" class="btn btn-success" target="_blank">
                                Ver documento cargado
                            </a>
                            <button id="deleteFiscalDoc" class="btn btn-danger" style="margin-left: 10px;">
                                Eliminar documento
                            </button>
                        </div>

                        <br>
                        <br>

                        <div class="custom-control custom-switch">
                            <input type="checkbox" class="custom-control-input" id="switchCurrentAddress">
                            <label class="custom-control-label" for="switchCurrentAddress">Usar como predeterminada</label>
                        </div>

                        <!-- Botón de envío -->
                        <div class="text-center">
                            <button id="save-billing-data" class="btn btn-primary btn-lg"><i class="fa fa-check"></i> Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
            <div id="div-alert"></div>
        </div>
    </div>
</div>
<style>
    .is-invalid {
        border-color: #dc3545 !important;
        background-color: #f8d7da !important;
    }

    .custom-file-upload {
        position: relative;
        margin-bottom: 20px;
    }

    .custom-file-upload .form-label {
        font-size: 14px;
        color: #555;
        font-weight: bold;
        margin-bottom: 8px;
        display: block;
    }

    .custom-file-upload .file-input-container {
        position: relative;
        width: 100%;
    }

    .custom-file-upload input[type="file"] {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
        cursor: pointer;
        z-index: 2;
    }

    .custom-file-upload .file-label {
        display: block;
        width: 100%;
        padding: 10px 15px;
        font-size: 14px;
        color: #555;
        background-color: #f8f9fa;
        border: 1px solid #ced4da;
        border-radius: 4px;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .custom-file-upload input[type="file"]:focus+.file-label {
        border-color: #80bdff;
        outline: none;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    input[type="file"].is-invalid {
        border: 1px solid red !important;
        outline: none;
    }

    input[type="file"]:focus+.file-label,
    input[type="file"].is-invalid+.file-label {
        color: red;
        font-weight: bold;
        border-color: #dc3545 !important;
    }
</style>
<?php
include 'php/container_end.php';
include 'php/footer.php';
?>
<script src="js/update_billing_data.js"></script>
<?php
include 'php/scripts_base.php';
include 'php/end_page.php';
