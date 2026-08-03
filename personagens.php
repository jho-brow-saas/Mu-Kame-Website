<?php
require_once('config.php');
exigir_login();

/*
 * personagens.php - PHP 5.2.1 + MSSQL
 * Requer que config.php já abra a conexão MSSQL e possua:
 * exigir_login(), usuario_logado(), get_characters(), get_account_data(),
 * get_cash_data(), get_online_status(), h(), t(), format_num(),
 * vip_nome(), classe_nome().
 */

$pageTitle = t('characters');
$u         = usuario_logado();
$accountId = $u['id'];

/* =========================================================
   CONFIGURAÇÕES
   ========================================================= */
define('CHAR_INVENTORY_BYTES', 3776);
define('WAREHOUSE_ITEMS_BYTES', 3840);
define('RESET_LEVEL_REQUIRED', 400);
define('RESET_LEVEL_AFTER', 1);

$DATA_DIR   = dirname(__FILE__).'/dados';
$AVATAR_DIR = dirname(__FILE__).'/uploads/avatars';

if (!is_dir($DATA_DIR)) {
    @mkdir($DATA_DIR, 0777);
}
if (!is_dir($AVATAR_DIR)) {
    @mkdir($AVATAR_DIR, 0777);
}

/* =========================================================
   HELPERS COMPATÍVEIS COM PHP 5.2.1
   ========================================================= */
function p_sql($value) {
    return str_replace("'", "''", trim($value));
}

function p_redirect($msg, $type) {
    $url = 'personagens.php?msg='.urlencode($msg).'&type='.urlencode($type);
    header('Location: '.$url);
    exit;
}

function p_csrf_token() {
    if (!isset($_SESSION['personagens_csrf']) || $_SESSION['personagens_csrf'] == '') {
        $_SESSION['personagens_csrf'] = md5(uniqid(mt_rand(), true));
    }
    return $_SESSION['personagens_csrf'];
}

function p_check_csrf() {
    return isset($_POST['csrf']) &&
           isset($_SESSION['personagens_csrf']) &&
           $_POST['csrf'] === $_SESSION['personagens_csrf'];
}

function p_character($account, $name) {
    $account = p_sql($account);
    $name    = p_sql($name);
    $q = mssql_query("
        SELECT TOP 1
            AccountID, Name, Class, cLevel, LevelUpPoint,
            Strength, Dexterity, Vitality, Energy, Leadership,
            Money, ResetCount, MasterResetCount, Kills, Deads
        FROM Character
        WHERE AccountID='".$account."' AND Name='".$name."'
    ");
    if (!$q) return false;
    $r = mssql_fetch_assoc($q);
    return $r ? $r : false;
}

function p_account_online($account) {
    $account = p_sql($account);
    $q = mssql_query("
        SELECT TOP 1 ConnectStat
        FROM MEMB_STAT
        WHERE memb___id='".$account."'
    ");
    if (!$q) return false;
    $r = mssql_fetch_assoc($q);
    return ($r && intval($r['ConnectStat']) === 1);
}

function p_begin() {
    return mssql_query("BEGIN TRANSACTION");
}
function p_commit() {
    return mssql_query("COMMIT TRANSACTION");
}
function p_rollback() {
    return mssql_query("ROLLBACK TRANSACTION");
}

function p_read_map($file) {
    $out = array();
    if (!file_exists($file)) return $out;

    $fp = @fopen($file, 'r');
    if (!$fp) return $out;

    while (!feof($fp)) {
        $line = trim(fgets($fp));
        if ($line == '' || substr($line, 0, 1) == '#') continue;
        $p = strpos($line, '|');
        if ($p === false) continue;

        $key = trim(substr($line, 0, $p));
        $val = trim(substr($line, $p + 1));
        $out[$key] = $val;
    }
    fclose($fp);
    return $out;
}

function p_write_map($file, $arr) {
    $fp = @fopen($file, 'c+');
    if (!$fp) return false;

    if (!flock($fp, LOCK_EX)) {
        fclose($fp);
        return false;
    }

    ftruncate($fp, 0);
    rewind($fp);

    foreach ($arr as $k => $v) {
        $k = str_replace(array("\r", "\n", "|"), '', $k);
        $v = str_replace(array("\r", "\n"), '', $v);
        fwrite($fp, $k.'|'.$v."\n");
    }

    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    return true;
}

function p_avatar_get($account) {
    $map = p_read_map(dirname(__FILE__).'/dados/avatars.txt');
    return isset($map[$account]) ? $map[$account] : '';
}

function p_ticket_file() {
    return dirname(__FILE__).'/dados/chamados.txt';
}

function p_tickets_read($account) {
    $list = array();
    $file = p_ticket_file();

    if (!file_exists($file)) return $list;

    $fp = @fopen($file, 'r');
    if (!$fp) return $list;

    while (!feof($fp)) {
        $line = trim(fgets($fp));
        if ($line == '') continue;

        $d = explode('|', $line);
        if (count($d) < 8) continue;

        if ($d[1] == $account) {
            $list[] = array(
                'id'        => $d[0],
                'account'   => $d[1],
                'setor'     => $d[2],
                'assunto'   => base64_decode($d[3]),
                'mensagem'  => base64_decode($d[4]),
                'status'    => $d[5],
                'data'      => $d[6],
                'resposta'  => base64_decode($d[7])
            );
        }
    }
    fclose($fp);

    return array_reverse($list);
}

function p_ticket_add($account, $setor, $assunto, $mensagem) {
    $file = p_ticket_file();
    $fp = @fopen($file, 'a');
    if (!$fp) return false;

    if (!flock($fp, LOCK_EX)) {
        fclose($fp);
        return false;
    }

    $id = date('YmdHis').mt_rand(100, 999);

    $row = array(
        $id,
        str_replace('|', '', $account),
        str_replace('|', '', $setor),
        base64_encode($assunto),
        base64_encode($mensagem),
        'aguardando',
        date('d/m/Y H:i'),
        base64_encode('')
    );

    fwrite($fp, implode('|', $row)."\n");
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    return true;
}

function p_base_stats($class) {
    /* Base stats usuais MU. Ajuste aqui caso seu servidor use valores custom. */
    $base = intval($class);
    if ($base >= 96) return array(32, 27, 25, 20, 0);  // RF
    if ($base >= 80) return array(21, 21, 18, 23, 0);  // Summoner
    if ($base >= 64) return array(26, 20, 20, 15, 25); // DL
    if ($base >= 48) return array(26, 26, 26, 26, 0);  // MG
    if ($base >= 32) return array(22, 25, 20, 15, 0);  // Elf
    if ($base >= 16) return array(28, 20, 25, 10, 0);  // DK
    return array(18, 18, 15, 30, 0);                   // DW
}

function p_class_options() {
    return array(
        0  => 'Dark Wizard',
        1  => 'Soul Master',
        2  => 'Grand Master',
        16 => 'Dark Knight',
        17 => 'Blade Knight',
        18 => 'Blade Master',
        32 => 'Fairy Elf',
        33 => 'Muse Elf',
        34 => 'High Elf',
        48 => 'Magic Gladiator',
        50 => 'Duel Master',
        64 => 'Dark Lord',
        66 => 'Lord Emperor',
        80 => 'Summoner',
        81 => 'Bloody Summoner',
        82 => 'Dimension Master',
        96 => 'Rage Fighter',
        98 => 'Fist Master'
    );
}

/* =========================================================
   AÇÕES
   ========================================================= */
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!p_check_csrf()) {
        p_redirect('Sessão expirada. Atualize a página e tente novamente.', 'error');
    }

    $action = isset($_POST['action']) ? $_POST['action'] : '';

    /* 1 - ALTERAR DADOS DA CONTA */
    if ($action == 'account_data') {
        $current = isset($_POST['current_password']) ? trim($_POST['current_password']) : '';
        $newPass = isset($_POST['new_password']) ? trim($_POST['new_password']) : '';
        $name    = isset($_POST['account_name']) ? trim($_POST['account_name']) : '';
        $email   = isset($_POST['email']) ? trim($_POST['email']) : '';

        if ($current == '') p_redirect('Informe sua senha atual.', 'error');
        if (strlen($name) > 10) p_redirect('O nome da conta aceita no máximo 10 caracteres.', 'error');
        if (strlen($email) > 50) p_redirect('O e-mail aceita no máximo 50 caracteres.', 'error');
        if ($newPass != '' && strlen($newPass) > 10) p_redirect('A nova senha aceita no máximo 10 caracteres.', 'error');

        $q = mssql_query("
            SELECT TOP 1 memb__pwd
            FROM MEMB_INFO
            WHERE memb___id='".p_sql($accountId)."'
        ");
        $r = $q ? mssql_fetch_assoc($q) : false;

        if (!$r || trim($r['memb__pwd']) != $current) {
            p_redirect('Senha atual incorreta.', 'error');
        }

        $sql = "
            UPDATE MEMB_INFO SET
                memb_name='".p_sql($name)."',
                mail_addr='".p_sql($email)."'";
        if ($newPass != '') {
            $sql .= ", memb__pwd='".p_sql($newPass)."'";
        }
        $sql .= " WHERE memb___id='".p_sql($accountId)."'";

        if (!mssql_query($sql)) p_redirect('Não foi possível alterar os dados da conta.', 'error');
        p_redirect('Dados da conta atualizados.', 'success');
    }

    /* 2 - ALTERAR NICK */
    if ($action == 'rename') {
        $old = isset($_POST['character']) ? trim($_POST['character']) : '';
        $new = isset($_POST['new_name']) ? trim($_POST['new_name']) : '';

        if (!p_character($accountId, $old)) p_redirect('Personagem inválido.', 'error');
        if (!preg_match('/^[A-Za-z0-9_]{3,10}$/', $new)) {
            p_redirect('O novo nick deve ter entre 3 e 10 caracteres: letras, números ou _.', 'error');
        }
        if (p_account_online($accountId)) {
            p_redirect('Desconecte a conta do jogo antes de alterar o nick.', 'error');
        }

        $check = mssql_query("SELECT TOP 1 Name FROM Character WHERE Name='".p_sql($new)."'");
        if ($check && mssql_fetch_assoc($check)) p_redirect('Este nick já está em uso.', 'error');

        p_begin();

        $ok = mssql_query("
            UPDATE Character
            SET Name='".p_sql($new)."'
            WHERE AccountID='".p_sql($accountId)."'
              AND Name='".p_sql($old)."'
        ");

        /* Mantém referências comuns sincronizadas quando as tabelas existirem. */
        @mssql_query("
            UPDATE GuildMember
            SET Name='".p_sql($new)."'
            WHERE Name='".p_sql($old)."'
        ");
        @mssql_query("
            UPDATE AccountCharacter
            SET GameIDC='".p_sql($new)."'
            WHERE Id='".p_sql($accountId)."'
              AND GameIDC='".p_sql($old)."'
        ");

        if (!$ok) {
            p_rollback();
            p_redirect('Não foi possível alterar o nick.', 'error');
        }

        p_commit();
        p_redirect('Nick alterado para '.$new.'.', 'success');
    }

    /* 3 - RESETAR PERSONAGEM */
    if ($action == 'reset_character') {
        $name = isset($_POST['character']) ? trim($_POST['character']) : '';
        $c = p_character($accountId, $name);

        if (!$c) p_redirect('Personagem inválido.', 'error');
        if (p_account_online($accountId)) p_redirect('Desconecte a conta antes de resetar.', 'error');
        if (intval($c['cLevel']) < RESET_LEVEL_REQUIRED) {
            p_redirect('É necessário estar no level '.RESET_LEVEL_REQUIRED.' para resetar.', 'error');
        }

        $st = p_base_stats($c['Class']);

        $ok = mssql_query("
            UPDATE Character SET
                cLevel=".RESET_LEVEL_AFTER.",
                LevelUpPoint=0,
                Strength=".$st[0].",
                Dexterity=".$st[1].",
                Vitality=".$st[2].",
                Energy=".$st[3].",
                Leadership=".$st[4].",
                ResetCount=ResetCount+1
            WHERE AccountID='".p_sql($accountId)."'
              AND Name='".p_sql($name)."'
        ");

        if (!$ok) p_redirect('Não foi possível resetar o personagem.', 'error');
        p_redirect('Personagem resetado com sucesso.', 'success');
    }

    /* 4 - VENDER 10 RESETS = 1 WCoinC */
    if ($action == 'sell_resets') {
        $name = isset($_POST['character']) ? trim($_POST['character']) : '';

        if (p_account_online($accountId)) p_redirect('Desconecte a conta antes de vender resets.', 'error');

        p_begin();

        $q = mssql_query("
            SELECT TOP 1 ResetCount
            FROM Character WITH (UPDLOCK, ROWLOCK)
            WHERE AccountID='".p_sql($accountId)."'
              AND Name='".p_sql($name)."'
        ");
        $r = $q ? mssql_fetch_assoc($q) : false;

        if (!$r || intval($r['ResetCount']) < 10) {
            p_rollback();
            p_redirect('São necessários pelo menos 10 resets.', 'error');
        }

        $ok1 = mssql_query("
            UPDATE Character
            SET ResetCount=ResetCount-10
            WHERE AccountID='".p_sql($accountId)."'
              AND Name='".p_sql($name)."'
        ");

        $cq = mssql_query("
            SELECT TOP 1 AccountID
            FROM CashShopData WITH (UPDLOCK, ROWLOCK)
            WHERE AccountID='".p_sql($accountId)."'
        ");
        $cr = $cq ? mssql_fetch_assoc($cq) : false;

        if ($cr) {
            $ok2 = mssql_query("
                UPDATE CashShopData
                SET WCoinC=ISNULL(WCoinC,0)+1
                WHERE AccountID='".p_sql($accountId)."'
            ");
        } else {
            $ok2 = mssql_query("
                INSERT INTO CashShopData (AccountID, WCoinC, WCoinP, GoblinPoint)
                VALUES ('".p_sql($accountId)."',1,0,0)
            ");
        }

        if (!$ok1 || !$ok2) {
            p_rollback();
            p_redirect('A venda não pôde ser concluída.', 'error');
        }

        p_commit();
        p_redirect('10 resets vendidos por 1 WCoinC.', 'success');
    }

    /* 5 - TRANSFERIR RESETS */
    if ($action == 'transfer_resets') {
        $from   = isset($_POST['from_character']) ? trim($_POST['from_character']) : '';
        $to     = isset($_POST['to_character']) ? trim($_POST['to_character']) : '';
        $amount = isset($_POST['amount']) ? intval($_POST['amount']) : 0;

        if ($from == $to) p_redirect('Escolha personagens diferentes.', 'error');
        if ($amount <= 0) p_redirect('Informe uma quantidade válida.', 'error');
        if (p_account_online($accountId)) p_redirect('Desconecte a conta antes da transferência.', 'error');

        p_begin();

        $q1 = mssql_query("
            SELECT TOP 1 ResetCount
            FROM Character WITH (UPDLOCK, ROWLOCK)
            WHERE AccountID='".p_sql($accountId)."'
              AND Name='".p_sql($from)."'
        ");
        $r1 = $q1 ? mssql_fetch_assoc($q1) : false;

        $q2 = mssql_query("
            SELECT TOP 1 ResetCount
            FROM Character WITH (UPDLOCK, ROWLOCK)
            WHERE AccountID='".p_sql($accountId)."'
              AND Name='".p_sql($to)."'
        ");
        $r2 = $q2 ? mssql_fetch_assoc($q2) : false;

        if (!$r1 || !$r2) {
            p_rollback();
            p_redirect('Personagem de origem ou destino inválido.', 'error');
        }
        if (intval($r1['ResetCount']) < $amount) {
            p_rollback();
            p_redirect('O personagem de origem não possui resets suficientes.', 'error');
        }

        $ok1 = mssql_query("
            UPDATE Character
            SET ResetCount=ResetCount-".$amount."
            WHERE AccountID='".p_sql($accountId)."'
              AND Name='".p_sql($from)."'
        ");
        $ok2 = mssql_query("
            UPDATE Character
            SET ResetCount=ResetCount+".$amount."
            WHERE AccountID='".p_sql($accountId)."'
              AND Name='".p_sql($to)."'
        ");

        if (!$ok1 || !$ok2) {
            p_rollback();
            p_redirect('Não foi possível transferir os resets.', 'error');
        }

        p_commit();
        p_redirect($amount.' resets transferidos com sucesso.', 'success');
    }

    /* 6 - AVATAR DA CONTA */
    if ($action == 'avatar') {
        $avatarPath = '';

        if (isset($_FILES['avatar']) && isset($_FILES['avatar']['tmp_name']) && is_uploaded_file($_FILES['avatar']['tmp_name'])) {
            $original = $_FILES['avatar']['name'];
            $ext = strtolower(pathinfo($original, PATHINFO_EXTENSION));

            if (!in_array($ext, array('jpg', 'jpeg', 'png', 'gif'))) {
                p_redirect('Use uma imagem JPG, PNG ou GIF.', 'error');
            }
            if (intval($_FILES['avatar']['size']) > 2097152) {
                p_redirect('O avatar deve ter no máximo 2 MB.', 'error');
            }

            $filename = 'avatar_'.md5($accountId.'_'.time()).'.'.$ext;
            $dest = $GLOBALS['AVATAR_DIR'].'/'.$filename;

            if (!@move_uploaded_file($_FILES['avatar']['tmp_name'], $dest)) {
                p_redirect('Não foi possível salvar o avatar.', 'error');
            }

            $avatarPath = 'uploads/avatars/'.$filename;
        } else {
            $avatarPath = isset($_POST['avatar_url']) ? trim($_POST['avatar_url']) : '';
        }

        if ($avatarPath == '') p_redirect('Envie uma imagem ou informe uma URL.', 'error');

        $map = p_read_map(dirname(__FILE__).'/dados/avatars.txt');
        $map[$accountId] = $avatarPath;

        if (!p_write_map(dirname(__FILE__).'/dados/avatars.txt', $map)) {
            p_redirect('Não foi possível gravar dados/avatars.txt.', 'error');
        }

        p_redirect('Avatar atualizado.', 'success');
    }

    /* 7 - DISTRIBUIR PONTOS */
    if ($action == 'distribute_points') {
        $name = isset($_POST['character']) ? trim($_POST['character']) : '';
        $str  = max(0, intval($_POST['strength']));
        $dex  = max(0, intval($_POST['dexterity']));
        $vit  = max(0, intval($_POST['vitality']));
        $ene  = max(0, intval($_POST['energy']));
        $cmd  = max(0, intval($_POST['leadership']));
        $sum  = $str + $dex + $vit + $ene + $cmd;

        $c = p_character($accountId, $name);
        if (!$c) p_redirect('Personagem inválido.', 'error');
        if (p_account_online($accountId)) p_redirect('Desconecte a conta antes de distribuir pontos.', 'error');
        if ($sum <= 0) p_redirect('Informe pelo menos 1 ponto.', 'error');
        if ($sum > intval($c['LevelUpPoint'])) p_redirect('Pontos disponíveis insuficientes.', 'error');

        $ok = mssql_query("
            UPDATE Character SET
                Strength=Strength+".$str.",
                Dexterity=Dexterity+".$dex.",
                Vitality=Vitality+".$vit.",
                Energy=Energy+".$ene.",
                Leadership=Leadership+".$cmd.",
                LevelUpPoint=LevelUpPoint-".$sum."
            WHERE AccountID='".p_sql($accountId)."'
              AND Name='".p_sql($name)."'
              AND LevelUpPoint >= ".$sum."
        ");

        if (!$ok) p_redirect('Não foi possível distribuir os pontos.', 'error');
        p_redirect($sum.' pontos distribuídos.', 'success');
    }

    /* 8 - LIMPAR BAÚ */
    if ($action == 'clear_warehouse') {
        if (p_account_online($accountId)) p_redirect('Desconecte a conta antes de limpar o baú.', 'error');

        $hex = str_repeat('FF', WAREHOUSE_ITEMS_BYTES);
        $ok = mssql_query("
            UPDATE warehouse
            SET Items=0x".$hex."
            WHERE AccountID='".p_sql($accountId)."'
        ");

        if (!$ok) p_redirect('Não foi possível limpar o baú. Confira o nome/campo da tabela warehouse.', 'error');
        p_redirect('Baú limpo com sucesso.', 'success');
    }

    /* 9 - LIMPAR INVENTÁRIO */
    if ($action == 'clear_inventory') {
        $name = isset($_POST['character']) ? trim($_POST['character']) : '';

        if (!p_character($accountId, $name)) p_redirect('Personagem inválido.', 'error');
        if (p_account_online($accountId)) p_redirect('Desconecte a conta antes de limpar o inventário.', 'error');

        $hex = str_repeat('FF', CHAR_INVENTORY_BYTES);
        $ok = mssql_query("
            UPDATE Character
            SET Inventory=0x".$hex."
            WHERE AccountID='".p_sql($accountId)."'
              AND Name='".p_sql($name)."'
        ");

        if (!$ok) p_redirect('Não foi possível limpar o inventário.', 'error');
        p_redirect('Inventário limpo com sucesso.', 'success');
    }

    /* 10 - FALE CONOSCO */
    if ($action == 'support') {
        $setor = isset($_POST['sector']) ? trim($_POST['sector']) : '';
        $subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
        $message = isset($_POST['message']) ? trim($_POST['message']) : '';

        if (!in_array($setor, array('suporte', 'financeiro', 'denuncias'))) {
            p_redirect('Selecione um setor válido.', 'error');
        }
        if ($subject == '' || $message == '') p_redirect('Preencha assunto e mensagem.', 'error');
        if (strlen($subject) > 100) p_redirect('O assunto deve ter no máximo 100 caracteres.', 'error');
        if (strlen($message) > 3000) p_redirect('A mensagem deve ter no máximo 3000 caracteres.', 'error');

        if (!p_ticket_add($accountId, $setor, $subject, $message)) {
            p_redirect('Não foi possível abrir o chamado.', 'error');
        }
        p_redirect('Chamado aberto. Status: aguardando.', 'success');
    }

    /* 12 - ALTERAR CLASSE */
    if ($action == 'change_class') {
        $name  = isset($_POST['character']) ? trim($_POST['character']) : '';
        $class = isset($_POST['class']) ? intval($_POST['class']) : -1;
        $classes = p_class_options();

        if (!p_character($accountId, $name)) p_redirect('Personagem inválido.', 'error');
        if (!isset($classes[$class])) p_redirect('Classe inválida.', 'error');
        if (p_account_online($accountId)) p_redirect('Desconecte a conta antes de alterar a classe.', 'error');

        $ok = mssql_query("
            UPDATE Character
            SET Class=".$class."
            WHERE AccountID='".p_sql($accountId)."'
              AND Name='".p_sql($name)."'
        ");

        if (!$ok) p_redirect('Não foi possível alterar a classe.', 'error');
        p_redirect('Classe alterada para '.$classes[$class].'.', 'success');
    }
}

/* =========================================================
   DADOS DA PÁGINA
   ========================================================= */
$chars   = get_characters($accountId);
$acc     = get_account_data($accountId);
$cash    = get_cash_data($accountId);
$stat    = get_online_status($accountId);
$avatar  = p_avatar_get($accountId);
$tickets = p_tickets_read($accountId);
$classes = p_class_options();

include('includes/header.php');
?>

<style type="text/css">
.account-profile{display:flex;align-items:center;gap:16px}
.account-avatar{width:72px;height:72px;border-radius:20px;overflow:hidden;background:linear-gradient(135deg,#7d4dff,#17d8ff);display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:bold;color:#fff;box-shadow:0 10px 35px rgba(93,71,255,.28)}
.account-avatar img{width:100%;height:100%;object-fit:cover}
.action-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:24px 0}
.action-card{border:1px solid rgba(119,104,255,.22);background:rgba(10,15,27,.82);border-radius:18px;padding:18px;cursor:pointer;color:#fff;text-align:left;transition:.2s;min-height:116px}
.action-card:hover{transform:translateY(-3px);border-color:#5fdcff;box-shadow:0 12px 35px rgba(0,210,255,.1)}
.action-card b{display:block;font-size:15px;margin-bottom:7px}
.action-card small{display:block;color:#8fa0b5;line-height:1.45}
.action-icon{display:inline-flex;width:34px;height:34px;border-radius:11px;align-items:center;justify-content:center;background:rgba(104,84,255,.16);margin-bottom:12px;color:#80e8ff}
.neo-modal{display:none;position:fixed;z-index:99999;left:0;top:0;width:100%;height:100%;overflow:auto;background:rgba(2,5,13,.78);backdrop-filter:blur(10px)}
.neo-modal.open{display:block}
.neo-modal-box{width:calc(100% - 34px);max-width:590px;margin:6vh auto;background:linear-gradient(145deg,rgba(17,23,38,.98),rgba(7,10,19,.99));border:1px solid rgba(107,222,255,.24);border-radius:24px;box-shadow:0 25px 100px rgba(0,0,0,.5);color:#fff;overflow:hidden}
.neo-modal-head{padding:20px 22px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center}
.neo-modal-head h3{margin:0}
.neo-modal-close{background:none;border:0;color:#9eb0c4;font-size:28px;cursor:pointer}
.neo-modal-body{padding:22px}
.neo-form label{display:block;font-size:12px;color:#9aacbf;margin:14px 0 6px}
.neo-form input,.neo-form select,.neo-form textarea{box-sizing:border-box;width:100%;padding:12px 13px;border-radius:12px;border:1px solid rgba(130,150,180,.22);background:#0b111d;color:#fff;outline:none}
.neo-form textarea{min-height:130px;resize:vertical}
.neo-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.neo-btn{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:12px;padding:12px 17px;background:linear-gradient(90deg,#705cff,#1fc8ed);color:#fff;font-weight:bold;cursor:pointer;margin-top:18px}
.neo-danger{background:linear-gradient(90deg,#c63b65,#ff6659)}
.neo-warning{padding:12px;border:1px solid rgba(255,190,65,.24);background:rgba(255,178,42,.07);border-radius:12px;color:#f0c97c;font-size:12px;line-height:1.5;margin-bottom:15px}
.flash-msg{padding:13px 16px;border-radius:13px;margin:16px 0}
.flash-success{background:rgba(53,219,160,.10);border:1px solid rgba(53,219,160,.25);color:#80efc7}
.flash-error{background:rgba(255,88,115,.10);border:1px solid rgba(255,88,115,.25);color:#ff9aac}
.ticket{padding:14px;border:1px solid rgba(255,255,255,.08);border-radius:13px;margin:10px 0;background:rgba(255,255,255,.025)}
.ticket-top{display:flex;justify-content:space-between;gap:10px}
.ticket-status{font-size:11px;border-radius:20px;padding:5px 9px;background:rgba(255,193,70,.1);color:#ffd47a}
.ticket-status.respondido{background:rgba(52,218,161,.1);color:#72e8bd}
@media(max-width:1050px){.action-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:760px){.action-grid{grid-template-columns:repeat(2,1fr)}.neo-row{grid-template-columns:1fr}}
@media(max-width:480px){.action-grid{grid-template-columns:1fr}.account-profile{align-items:flex-start}}
</style>

<div class="page-head">
    <div class="account-profile">
        <div class="account-avatar">
            <?php if ($avatar != '') { ?>
                <img src="<?php echo h($avatar); ?>" alt="Avatar" />
            <?php } else { ?>
                <?php echo strtoupper(substr($accountId, 0, 1)); ?>
            <?php } ?>
        </div>
        <div>
            <span class="eyebrow"><?php echo h(t('my_account')); ?></span>
            <h1><?php echo h($accountId); ?></h1>
        </div>
    </div>
</div>

<?php if (isset($_GET['msg']) && $_GET['msg'] != '') { ?>
<div class="flash-msg <?php echo (isset($_GET['type']) && $_GET['type']=='success')?'flash-success':'flash-error'; ?>">
    <?php echo h($_GET['msg']); ?>
</div>
<?php } ?>

<section class="stats-grid">
    <div class="panel stat"><small>VIP</small><strong><?php echo h(vip_nome($acc['AccountLevel'])); ?></strong></div>
    <div class="panel stat"><small>WCoinC</small><strong><?php echo format_num($cash['WCoinC']); ?></strong></div>
    <div class="panel stat"><small><?php echo h(t('status')); ?></small><strong><?php echo intval($stat['ConnectStat'])===1?'ONLINE':'OFFLINE'; ?></strong></div>
    <div class="panel stat"><small><?php echo h(t('characters_count')); ?></small><strong><?php echo count($chars); ?></strong></div>
</section>

<!-- 12 OPÇÕES -->
<section class="action-grid">
    <button class="action-card" type="button" onclick="openNeoModal('modalAccount')"><span class="action-icon">⚙</span><b>Alterar dados da conta</b><small>Nome, e-mail e senha.</small></button>
    <button class="action-card" type="button" onclick="openNeoModal('modalRename')"><span class="action-icon">✎</span><b>Alterar nick</b><small>Troque o nome de um personagem.</small></button>
    <button class="action-card" type="button" onclick="openNeoModal('modalReset')"><span class="action-icon">↻</span><b>Resetar personagem</b><small>Reset pelo painel do usuário.</small></button>
    <button class="action-card" type="button" onclick="openNeoModal('modalSell')"><span class="action-icon">◈</span><b>Vender resets</b><small>10 resets = 1 WCoinC.</small></button>
    <button class="action-card" type="button" onclick="openNeoModal('modalTransfer')"><span class="action-icon">⇄</span><b>Transferir resets</b><small>Somente entre seus personagens.</small></button>
    <button class="action-card" type="button" onclick="openNeoModal('modalAvatar')"><span class="action-icon">◎</span><b>Alterar avatar</b><small>Imagem salva no perfil da conta.</small></button>
    <button class="action-card" type="button" onclick="openNeoModal('modalPoints')"><span class="action-icon">+</span><b>Distribuir pontos</b><small>STR, AGI, VIT, ENE e CMD.</small></button>
    <button class="action-card" type="button" onclick="openNeoModal('modalWarehouse')"><span class="action-icon">□</span><b>Limpar baú</b><small>Remove todos os itens do baú.</small></button>
    <button class="action-card" type="button" onclick="openNeoModal('modalInventory')"><span class="action-icon">◇</span><b>Limpar inventário</b><small>Remove itens de um personagem.</small></button>
    <button class="action-card" type="button" onclick="openNeoModal('modalSupport')"><span class="action-icon">?</span><b>Fale conosco</b><small>Suporte, financeiro e denúncias.</small></button>
    <button class="action-card" type="button" onclick="openNeoModal('modalTickets')"><span class="action-icon">☰</span><b>Ver chamados</b><small>Acompanhe aguardando/respondido.</small></button>
    <button class="action-card" type="button" onclick="openNeoModal('modalClass')"><span class="action-icon">★</span><b>Alterar classe</b><small>Escolha a nova classe.</small></button>
</section>

<div class="cards-grid section-gap">
<?php if (!count($chars)) { ?>
    <div class="panel empty"><?php echo h(t('no_characters')); ?></div>
<?php } ?>

<?php foreach ($chars as $c) { ?>
<article class="panel char-card">
    <div class="char-icon"><?php echo strtoupper(substr($c['Name'],0,1)); ?></div>
    <div>
        <span class="eyebrow"><?php echo h(classe_nome($c['Class'])); ?></span>
        <h2><?php echo h($c['Name']); ?></h2>
        <p>
            <?php echo h(t('level')); ?> <?php echo format_num($c['cLevel']); ?>
            &bull;
            <?php echo format_num($c['ResetCount']).' '.h(t('resets')); ?>
            &bull;
            <?php echo format_num($c['LevelUpPoint']); ?> pontos
        </p>
    </div>
    <div class="char-kpis">
        <span><b><?php echo format_num($c['Kills']); ?></b><?php echo h(t('kills')); ?></span>
        <span><b><?php echo format_num($c['Deads']); ?></b><?php echo h(t('deads')); ?></span>
        <span><b><?php echo format_num($c['Money']); ?></b>Zen</span>
    </div>
</article>
<?php } ?>
</div>

<?php
function char_select_options($chars) {
    foreach ($chars as $cc) {
        echo '<option value="'.h($cc['Name']).'">'.h($cc['Name']).' - '.intval($cc['ResetCount']).' resets</option>';
    }
}
$csrf = p_csrf_token();
?>

<!-- 1 -->
<div class="neo-modal" id="modalAccount"><div class="neo-modal-box">
<div class="neo-modal-head"><h3>Alterar dados da conta</h3><button class="neo-modal-close" onclick="closeNeoModal('modalAccount')" type="button">&times;</button></div>
<div class="neo-modal-body"><form class="neo-form" method="post">
<input type="hidden" name="csrf" value="<?php echo h($csrf); ?>" /><input type="hidden" name="action" value="account_data" />
<label>Nome</label><input name="account_name" maxlength="10" value="<?php echo isset($acc['memb_name'])?h($acc['memb_name']):''; ?>" />
<label>E-mail</label><input type="text" name="email" maxlength="50" value="<?php echo isset($acc['mail_addr'])?h($acc['mail_addr']):''; ?>" />
<label>Senha atual *</label><input type="password" name="current_password" maxlength="10" required="required" />
<label>Nova senha</label><input type="password" name="new_password" maxlength="10" />
<button class="neo-btn" type="submit">Salvar alterações</button>
</form></div></div></div>

<!-- 2 -->
<div class="neo-modal" id="modalRename"><div class="neo-modal-box">
<div class="neo-modal-head"><h3>Alterar nick</h3><button class="neo-modal-close" onclick="closeNeoModal('modalRename')" type="button">&times;</button></div>
<div class="neo-modal-body"><div class="neo-warning">A conta deve estar offline. O novo nick deve ter de 3 a 10 caracteres.</div>
<form class="neo-form" method="post"><input type="hidden" name="csrf" value="<?php echo h($csrf); ?>" /><input type="hidden" name="action" value="rename" />
<label>Personagem</label><select name="character"><?php char_select_options($chars); ?></select>
<label>Novo nick</label><input name="new_name" maxlength="10" required="required" />
<button class="neo-btn" type="submit">Alterar nick</button></form></div></div></div>

<!-- 3 -->
<div class="neo-modal" id="modalReset"><div class="neo-modal-box">
<div class="neo-modal-head"><h3>Resetar personagem</h3><button class="neo-modal-close" onclick="closeNeoModal('modalReset')" type="button">&times;</button></div>
<div class="neo-modal-body"><div class="neo-warning">Requer level <?php echo RESET_LEVEL_REQUIRED; ?>. A conta deve estar offline. O reset volta o personagem para o level <?php echo RESET_LEVEL_AFTER; ?> e aplica os atributos base configurados neste arquivo.</div>
<form class="neo-form" method="post"><input type="hidden" name="csrf" value="<?php echo h($csrf); ?>" /><input type="hidden" name="action" value="reset_character" />
<label>Personagem</label><select name="character"><?php char_select_options($chars); ?></select>
<button class="neo-btn" type="submit">Confirmar reset</button></form></div></div></div>

<!-- 4 -->
<div class="neo-modal" id="modalSell"><div class="neo-modal-box">
<div class="neo-modal-head"><h3>Vender resets</h3><button class="neo-modal-close" onclick="closeNeoModal('modalSell')" type="button">&times;</button></div>
<div class="neo-modal-body"><div class="neo-warning"><strong>Taxa fixa:</strong> 10 resets = 1 WCoinC. Cada operação vende exatamente 10 resets.</div>
<form class="neo-form" method="post"><input type="hidden" name="csrf" value="<?php echo h($csrf); ?>" /><input type="hidden" name="action" value="sell_resets" />
<label>Personagem</label><select name="character"><?php char_select_options($chars); ?></select>
<button class="neo-btn" type="submit">Vender 10 resets</button></form></div></div></div>

<!-- 5 -->
<div class="neo-modal" id="modalTransfer"><div class="neo-modal-box">
<div class="neo-modal-head"><h3>Transferir resets</h3><button class="neo-modal-close" onclick="closeNeoModal('modalTransfer')" type="button">&times;</button></div>
<div class="neo-modal-body"><div class="neo-warning">A transferência funciona somente entre personagens pertencentes à mesma conta.</div>
<form class="neo-form" method="post"><input type="hidden" name="csrf" value="<?php echo h($csrf); ?>" /><input type="hidden" name="action" value="transfer_resets" />
<div class="neo-row"><div><label>Origem</label><select name="from_character"><?php char_select_options($chars); ?></select></div><div><label>Destino</label><select name="to_character"><?php char_select_options($chars); ?></select></div></div>
<label>Quantidade</label><input type="text" name="amount" value="1" />
<button class="neo-btn" type="submit">Transferir</button></form></div></div></div>

<!-- 6 -->
<div class="neo-modal" id="modalAvatar"><div class="neo-modal-box">
<div class="neo-modal-head"><h3>Alterar avatar da conta</h3><button class="neo-modal-close" onclick="closeNeoModal('modalAvatar')" type="button">&times;</button></div>
<div class="neo-modal-body"><form class="neo-form" method="post" enctype="multipart/form-data"><input type="hidden" name="csrf" value="<?php echo h($csrf); ?>" /><input type="hidden" name="action" value="avatar" />
<label>Enviar imagem</label><input type="file" name="avatar" />
<label>ou URL/caminho da imagem</label><input name="avatar_url" value="<?php echo h($avatar); ?>" />
<button class="neo-btn" type="submit">Salvar avatar</button></form></div></div></div>

<!-- 7 -->
<div class="neo-modal" id="modalPoints"><div class="neo-modal-box">
<div class="neo-modal-head"><h3>Distribuir pontos</h3><button class="neo-modal-close" onclick="closeNeoModal('modalPoints')" type="button">&times;</button></div>
<div class="neo-modal-body"><form class="neo-form" method="post"><input type="hidden" name="csrf" value="<?php echo h($csrf); ?>" /><input type="hidden" name="action" value="distribute_points" />
<label>Personagem</label><select name="character"><?php char_select_options($chars); ?></select>
<div class="neo-row"><div><label>Força</label><input name="strength" value="0" /></div><div><label>Agilidade</label><input name="dexterity" value="0" /></div></div>
<div class="neo-row"><div><label>Vitalidade</label><input name="vitality" value="0" /></div><div><label>Energia</label><input name="energy" value="0" /></div></div>
<label>Comando / Leadership</label><input name="leadership" value="0" />
<button class="neo-btn" type="submit">Distribuir pontos</button></form></div></div></div>

<!-- 8 -->
<div class="neo-modal" id="modalWarehouse"><div class="neo-modal-box">
<div class="neo-modal-head"><h3>Limpar baú</h3><button class="neo-modal-close" onclick="closeNeoModal('modalWarehouse')" type="button">&times;</button></div>
<div class="neo-modal-body"><div class="neo-warning">Esta operação remove todos os itens do baú e não possui desfazer. A conta precisa estar offline.</div>
<form class="neo-form" method="post" onsubmit="return confirm('Tem certeza que deseja apagar TODOS os itens do baú?');"><input type="hidden" name="csrf" value="<?php echo h($csrf); ?>" /><input type="hidden" name="action" value="clear_warehouse" />
<button class="neo-btn neo-danger" type="submit">Limpar todo o baú</button></form></div></div></div>

<!-- 9 -->
<div class="neo-modal" id="modalInventory"><div class="neo-modal-box">
<div class="neo-modal-head"><h3>Limpar inventário</h3><button class="neo-modal-close" onclick="closeNeoModal('modalInventory')" type="button">&times;</button></div>
<div class="neo-modal-body"><div class="neo-warning">Todos os itens do inventário do personagem selecionado serão removidos.</div>
<form class="neo-form" method="post" onsubmit="return confirm('Tem certeza que deseja limpar o inventário?');"><input type="hidden" name="csrf" value="<?php echo h($csrf); ?>" /><input type="hidden" name="action" value="clear_inventory" />
<label>Personagem</label><select name="character"><?php char_select_options($chars); ?></select>
<button class="neo-btn neo-danger" type="submit">Limpar inventário</button></form></div></div></div>

<!-- 10 -->
<div class="neo-modal" id="modalSupport"><div class="neo-modal-box">
<div class="neo-modal-head"><h3>Fale conosco</h3><button class="neo-modal-close" onclick="closeNeoModal('modalSupport')" type="button">&times;</button></div>
<div class="neo-modal-body"><form class="neo-form" method="post"><input type="hidden" name="csrf" value="<?php echo h($csrf); ?>" /><input type="hidden" name="action" value="support" />
<label>Setor</label><select name="sector"><option value="suporte">Suporte</option><option value="financeiro">Financeiro</option><option value="denuncias">Denúncias</option></select>
<label>Assunto</label><input name="subject" maxlength="100" required="required" />
<label>Mensagem</label><textarea name="message" required="required"></textarea>
<button class="neo-btn" type="submit">Abrir chamado</button></form></div></div></div>

<!-- 11 -->
<div class="neo-modal" id="modalTickets"><div class="neo-modal-box">
<div class="neo-modal-head"><h3>Meus chamados</h3><button class="neo-modal-close" onclick="closeNeoModal('modalTickets')" type="button">&times;</button></div>
<div class="neo-modal-body">
<?php if (!count($tickets)) { ?><div class="neo-warning">Você ainda não possui chamados.</div><?php } ?>
<?php foreach ($tickets as $tk) { ?>
<div class="ticket">
<div class="ticket-top"><strong>#<?php echo h($tk['id']).' - '.h($tk['assunto']); ?></strong><span class="ticket-status <?php echo $tk['status']=='respondido'?'respondido':''; ?>"><?php echo h($tk['status']); ?></span></div>
<small><?php echo h($tk['setor']).' • '.h($tk['data']); ?></small>
<p><?php echo nl2br(h($tk['mensagem'])); ?></p>
<?php if ($tk['resposta'] != '') { ?><div class="neo-warning"><strong>Resposta:</strong><br /><?php echo nl2br(h($tk['resposta'])); ?></div><?php } ?>
</div>
<?php } ?>
</div></div></div>

<!-- 12 -->
<div class="neo-modal" id="modalClass"><div class="neo-modal-box">
<div class="neo-modal-head"><h3>Alterar classe</h3><button class="neo-modal-close" onclick="closeNeoModal('modalClass')" type="button">&times;</button></div>
<div class="neo-modal-body"><div class="neo-warning">Habilite apenas classes suportadas pelo seu GameServer/cliente. A conta deve estar offline.</div>
<form class="neo-form" method="post"><input type="hidden" name="csrf" value="<?php echo h($csrf); ?>" /><input type="hidden" name="action" value="change_class" />
<label>Personagem</label><select name="character"><?php char_select_options($chars); ?></select>
<label>Nova classe</label><select name="class">
<?php foreach ($classes as $classId => $className) { ?><option value="<?php echo intval($classId); ?>"><?php echo h($className); ?> (<?php echo intval($classId); ?>)</option><?php } ?>
</select>
<button class="neo-btn" type="submit">Alterar classe</button></form></div></div></div>

<script type="text/javascript">
function openNeoModal(id){
    var el=document.getElementById(id);
    if(el){el.className='neo-modal open';document.body.style.overflow='hidden';}
}
function closeNeoModal(id){
    var el=document.getElementById(id);
    if(el){el.className='neo-modal';document.body.style.overflow='';}
}
document.onkeydown=function(e){
    e=e||window.event;
    if(e.keyCode==27){
        var all=document.getElementsByTagName('div');
        for(var i=0;i<all.length;i++){
            if(all[i].className=='neo-modal open'){all[i].className='neo-modal';}
        }
        document.body.style.overflow='';
    }
};
</script>

<?php include('includes/footer.php'); ?>
