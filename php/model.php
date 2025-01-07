<?php

use App\Models\DataConn;

class BillingData extends DataConn
{
    private $conn;
    public function __construct()
    {
        $this->conn = $this->dbConn();
    }
    public function getBillingTypes($family_code)
    {
        $results = array();
        $sql = "SELECT bty.billing_type_description, bty.id_billing_types,
          CASE
            WHEN fba.current_address = 1 THEN 1
            WHEN bty.id_billing_types = 1 THEN 1
            ELSE 0
          END AS active_billing
            FROM families_billing_data.billing_types AS bty
            INNER JOIN families_ykt.families AS fam ON fam.family_code = :family_code
            LEFT JOIN families_billing_data.families_billing_addresses AS fba ON fba.id_billing_types = bty.id_billing_types AND fba.current_address = 1 AND fba.id_family = fam.id_family
            ORDER BY bty.id_billing_types
        ";

        $status = 1;
        $group_type_id = 1;

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':family_code', $family_code, PDO::PARAM_STR);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_OBJ)) {
            $results[] = $row;
        }

        return $results;
    }
    public function getCurrentBillingType($family_code)
    {
        /* $family_code = 'AA13'; */
        $results = array();
        $sql = "SELECT bty.id_billing_types
            FROM families_billing_data.billing_types AS bty
            INNER JOIN families_ykt.families AS fam ON fam.family_code = :family_code
            INNER JOIN families_billing_data.families_billing_addresses AS fba ON fba.id_billing_types = bty.id_billing_types AND fba.current_address = 1 AND fba.id_family = fam.id_family
            ORDER BY bty.id_billing_types
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':family_code', $family_code, PDO::PARAM_STR);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_OBJ)) {
            $results[] = $row;
        }

        return $results;
    }

    public function getFamilyBillingData($family_code, $id_billing_type)
    {
        /* $family_code = 'AA13'; */
        $results = array();
        $sql = "SELECT fba.*
            FROM families_ykt.families AS fam
            INNER JOIN families_billing_data.families_billing_addresses AS fba
                ON  fba.id_family = fam.id_family
            WHERE fam.family_code = :family_code AND fba.id_billing_types = :id_billing_type
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':family_code', $family_code, PDO::PARAM_STR);
        $stmt->bindParam(':id_billing_type', $id_billing_type, PDO::PARAM_INT);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_OBJ)) {
            $results[] = $row;
        }

        return $results;
    }
    public function saveOrUpdateBillingData($family_code, $data)
    {
        try {
            // Obtener el ID de la familia a partir del código
            $sqlFamily = "SELECT id_family FROM families_ykt.families WHERE family_code = :family_code";
            $stmtFamily = $this->conn->prepare($sqlFamily);
            $stmtFamily->bindParam(':family_code', $family_code, PDO::PARAM_STR);
            $stmtFamily->execute();
            $family = $stmtFamily->fetch(PDO::FETCH_OBJ);

            if (!$family) {
                throw new Exception("Código de familia no encontrado.");
            }

            $id_family = $family->id_family;

            // Validar si ya existe un registro con los mismos datos
            $sqlCheck = "SELECT id_families_billing_addresses 
                     FROM families_billing_data.families_billing_addresses 
                     WHERE id_family = :id_family AND id_billing_types = :id_billing_types";
            $stmtCheck = $this->conn->prepare($sqlCheck);
            $stmtCheck->bindParam(':id_family', $id_family, PDO::PARAM_INT);
            $stmtCheck->bindParam(':id_billing_types', $data['idBillingType'], PDO::PARAM_INT);
            $stmtCheck->execute();
            $existing = $stmtCheck->fetch(PDO::FETCH_OBJ);

            if ($existing) {

                $current_address =  $data['currentAddress'];;
                if ($current_address == 1) {
                    $sqlCheck = "UPDATE families_billing_data.families_billing_addresses
                     SET current_address = 0
                     WHERE id_family = :id_family";
                    $stmtCheck = $this->conn->prepare($sqlCheck);
                    $stmtCheck->bindParam(':id_family', $id_family, PDO::PARAM_INT);
                    $stmtCheck->execute();
                }

                // Actualizar el registro existente
                $sqlUpdate = "UPDATE families_billing_data.families_billing_addresses SET
                    id_cfdi_uses = :id_cfdi_uses,
                    id_tax_regimes = :id_tax_regimes,
                    id_tax_object = :id_tax_object,
                    business_name = :business_name,
                    rfc = :rfc,
                    mail = :mail,
                    street = :street,
                    between_streets = :between_streets,
                    ext_number = :ext_number,
                    int_number = :int_number,
                    colony = :colony,
                    delegation = :delegation,
                    postal_code = :postal_code,
                    current_address = :current_address
                    WHERE id_families_billing_addresses = :id_families_billing_addresses";

                $stmtUpdate = $this->conn->prepare($sqlUpdate);
                // Asignar parámetros comunes
                $id_tax_object = 1;

                // Asignar parámetros de actualización o inserción
                $stmtUpdate->bindParam(':id_cfdi_uses', $data['cfdi_use'], PDO::PARAM_INT);
                $stmtUpdate->bindParam(':id_tax_regimes', $data['tax_regime'], PDO::PARAM_INT);
                $stmtUpdate->bindParam(':id_tax_object', $id_tax_object, PDO::PARAM_INT);
                $stmtUpdate->bindParam(':business_name', $data['business_name'], PDO::PARAM_STR);
                $stmtUpdate->bindParam(':rfc', $data['rfc'], PDO::PARAM_STR);
                $stmtUpdate->bindParam(':mail', $data['mail'], PDO::PARAM_STR);
                $stmtUpdate->bindParam(':street', $data['street'], PDO::PARAM_STR);
                $stmtUpdate->bindParam(':between_streets', $data['between_streets'], PDO::PARAM_STR);
                $stmtUpdate->bindParam(':ext_number', $data['ext_number'], PDO::PARAM_STR);
                $stmtUpdate->bindParam(':int_number', $data['int_number'], PDO::PARAM_STR);
                $stmtUpdate->bindParam(':colony', $data['colony'], PDO::PARAM_STR);
                $stmtUpdate->bindParam(':delegation', $data['municipality'], PDO::PARAM_STR);
                $stmtUpdate->bindParam(':postal_code', $data['postal_code'], PDO::PARAM_INT);
                $stmtUpdate->bindParam(':current_address', $current_address, PDO::PARAM_INT);
                $stmtUpdate->bindParam(':id_families_billing_addresses', $existing->id_families_billing_addresses, PDO::PARAM_INT);
                return $stmtUpdate->execute();
            } else {


                $current_address =  $data['currentAddress'];;
                if ($current_address == 1) {
                    $sqlCheck = "UPDATE families_billing_data.families_billing_addresses
                     SET current_address = 0
                     WHERE id_family = :id_family";
                    $stmtCheck = $this->conn->prepare($sqlCheck);
                    $stmtCheck->bindParam(':id_family', $id_family, PDO::PARAM_INT);
                    $stmtCheck->execute();
                }

                // Insertar un nuevo registro
                $sqlInsert = "INSERT INTO families_billing_data.families_billing_addresses (
                id_billing_types, id_family, id_cfdi_uses, id_tax_regimes, id_tax_object, 
                business_name, rfc, mail, street, between_streets, ext_number, int_number, colony, delegation, postal_code, current_address
            ) VALUES (
                :id_billing_types, :id_family, :id_cfdi_uses, :id_tax_regimes, :id_tax_object, 
                :business_name, :rfc, :mail, :street, :between_streets, :ext_number, :int_number, :colony, :delegation, :postal_code, :current_address
            )";

                $stmtInsert = $this->conn->prepare($sqlInsert);
                // Asignar parámetros comunes
                $id_tax_object = 1;

                // Asignar parámetros de actualización o inserción
                $stmtInsert->bindParam(':id_billing_types', $data['idBillingType'], PDO::PARAM_INT);
                $stmtInsert->bindParam(':id_family', $id_family, PDO::PARAM_INT);
                $stmtInsert->bindParam(':id_cfdi_uses', $data['cfdi_use'], PDO::PARAM_INT);
                $stmtInsert->bindParam(':id_tax_regimes', $data['tax_regime'], PDO::PARAM_INT);
                $stmtInsert->bindParam(':id_tax_object', $id_tax_object, PDO::PARAM_INT);
                $stmtInsert->bindParam(':business_name', $data['business_name'], PDO::PARAM_STR);
                $stmtInsert->bindParam(':rfc', $data['rfc'], PDO::PARAM_STR);
                $stmtInsert->bindParam(':mail', $data['mail'], PDO::PARAM_STR);
                $stmtInsert->bindParam(':street', $data['street'], PDO::PARAM_STR);
                $stmtInsert->bindParam(':between_streets', $data['between_streets'], PDO::PARAM_STR);
                $stmtInsert->bindParam(':ext_number', $data['ext_number'], PDO::PARAM_STR);
                $stmtInsert->bindParam(':int_number', $data['int_number'], PDO::PARAM_STR);
                $stmtInsert->bindParam(':colony', $data['colony'], PDO::PARAM_STR);
                $stmtInsert->bindParam(':delegation', $data['municipality'], PDO::PARAM_STR);
                $stmtInsert->bindParam(':postal_code', $data['postal_code'], PDO::PARAM_INT);
                $stmtInsert->bindParam(':current_address', $current_address, PDO::PARAM_INT);
                // Ejecutar la consulta
                return $stmtInsert->execute();
            }
        } catch (Exception $e) {
            throw $e;
        }
    }



    public function getStates()
    {
        $sql = "SELECT *
        FROM matriz_direcciones.estados AS est
        ORDER BY estado
    ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_OBJ)) {
            $results[] = $row;
        }

        return $results;
    }

    public function getMunicipalitiesByState($id_state)
    {
        $sql = "SELECT mun.*
        FROM matriz_direcciones.estados_municipios AS rel
        INNER JOIN  matriz_direcciones.municipios AS mun ON rel.municipios_id = mun.id
        WHERE rel.estados_id = :id_state
        ORDER BY municipio
    ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_state', $id_state, PDO::PARAM_INT);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_OBJ)) {
            $results[] = $row;
        }

        return $results;
    }

    public function getTaxRegimes()
    {
        $sql = "SELECT *
        FROM families_billing_data.tax_regimes
        ORDER BY id_tax_regimes
    ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_OBJ)) {
            $results[] = $row;
        }

        return $results;
    }
    public function getCFDI_Uses()
    {
        $sql = "SELECT *
        FROM families_billing_data.cfdi_uses
        ORDER BY id_cfdi_uses
    ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_OBJ)) {
            $results[] = $row;
        }

        return $results;
    }
    public function getTaxObject()
    {
        $sql = "SELECT *
        FROM families_billing_data.tax_object
        ORDER BY id_tax_object
    ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_OBJ)) {
            $results[] = $row;
        }

        return $results;
    }
}
