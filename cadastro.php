<?php

require_once('config.php');

$auth_error = '';
$register_message = '';
$open_auth_modal = 'register';

/*
|--------------------------------------------------------------------------
| PROCESSAR CADASTRO
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    /*
    |--------------------------------------------------------------------------
    | VALIDAR CSRF
    |--------------------------------------------------------------------------
    */

    if (!validar_csrf()) {

        $auth_error = t('fill_fields');

    } else {

        /*
        |--------------------------------------------------------------------------
        | RECEBER DADOS
        |--------------------------------------------------------------------------
        */

        $id = isset($_POST['id'])
            ? trim($_POST['id'])
            : '';

        $pw = isset($_POST['pw'])
            ? trim($_POST['pw'])
            : '';

        $name = isset($_POST['name'])
            ? trim($_POST['name'])
            : '';

        $mail = isset($_POST['mail'])
            ? trim($_POST['mail'])
            : '';

        /*
        |--------------------------------------------------------------------------
        | VALIDAR CAMPOS
        |--------------------------------------------------------------------------
        */

        if (
            $id == '' ||
            $pw == '' ||
            $name == '' ||
            $mail == ''
        ) {

            $auth_error = t('fill_fields');

        } elseif (
            strlen($id) > 10 ||
            strlen($pw) > 10 ||
            strlen($name) > 10
        ) {

            $auth_error = t('fill_fields');

        } elseif (!db_ok()) {

            $auth_error = t('db_unavailable');

        } else {

            /*
            |--------------------------------------------------------------------------
            | ESCAPAR DADOS
            |--------------------------------------------------------------------------
            */

            $sid = sql_escape($id);
            $spw = sql_escape($pw);
            $sn = sql_escape($name);
            $sm = sql_escape($mail);

            /*
            |--------------------------------------------------------------------------
            | VERIFICAR CONTA EXISTENTE
            |--------------------------------------------------------------------------
            */

            $sql_check = "
                SELECT memb___id
                FROM MEMB_INFO
                WHERE memb___id = '" . $sid . "'
            ";

            $check = @mssql_query($sql_check);

            if (!$check) {

                $auth_error = 'Erro ao consultar MEMB_INFO: ' .
                    mssql_get_last_message();

            } elseif (@mssql_num_rows($check) > 0) {

                $auth_error = t('account_exists');

            } else {

                /*
                |--------------------------------------------------------------------------
                | CADASTRAR CONTA
                |--------------------------------------------------------------------------
                |
                | Foram mantidas apenas as colunas mais comuns da MEMB_INFO.
                | Isso evita falhas por colunas inexistentes como:
                |
                | Lock
                | resale
                | datebegin
                | dateend
                | amount
                | gold
                | apolo_medal
                |
                */

                $sql_insert = "
                    INSERT INTO MEMB_INFO
                    (
                        memb___id,
                        memb__pwd,
                        memb_name,
                        sno__numb,
                        mail_addr,
                        bloc_code,
                        ctl1_code,
                        AccountLevel,
                        AccountExpireDate
                    )
                    VALUES
                    (
                        '" . $sid . "',
                        '" . $spw . "',
                        '" . $sn . "',
                        '111111111111111111',
                        '" . $sm . "',
                        '0',
                        '0',
                        0,
                        GETDATE()
                    )
                ";

                $insert = @mssql_query($sql_insert);

                if ($insert) {

                    /*
                    |--------------------------------------------------------------------------
                    | CRIAR REGISTRO DE SALDO
                    |--------------------------------------------------------------------------
                    */

                    $sql_cashshop = "
                        IF NOT EXISTS
                        (
                            SELECT AccountID
                            FROM CashShopData
                            WHERE AccountID = '" . $sid . "'
                        )
                        BEGIN

                            INSERT INTO CashShopData
                            (
                                AccountID,
                                WCoinC,
                                WCoinP,
                                GoblinPoint
                            )
                            VALUES
                            (
                                '" . $sid . "',
                                0,
                                0,
                                0
                            )

                        END
                    ";

                    $cashshop_result = @mssql_query($sql_cashshop);

                    /*
                    |--------------------------------------------------------------------------
                    | CADASTRO CONCLUÍDO
                    |--------------------------------------------------------------------------
                    */

                    $register_message = t('account_created');
                    $open_auth_modal = 'login';

                } else {

                    /*
                    |--------------------------------------------------------------------------
                    | EXIBIR ERRO REAL TEMPORARIAMENTE
                    |--------------------------------------------------------------------------
                    */

                    $auth_error = 'Erro ao criar conta: ' .
                        mssql_get_last_message();
                }
            }
        }
    }
}

/*
|--------------------------------------------------------------------------
| CARREGAR PÁGINA
|--------------------------------------------------------------------------
*/

$pageTitle = t('register');

include('includes/header.php');

?>

<div class="page-head">

    <span class="eyebrow">
        <?php echo h(t('new_account')); ?>
    </span>

    <h1>
        <?php echo h(t('join_server')); ?>
    </h1>

</div>

<?php include('includes/footer.php'); ?>