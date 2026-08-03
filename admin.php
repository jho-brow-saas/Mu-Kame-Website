<?php
require_once('config.php');
exigir_admin();

$pageTitle = t('admin');
$msg  = '';
$erro = '';

/*
=========================================================
PAINEL ADMINISTRATIVO MU NEON
PHP 5.2.1 + MSSQL
=========================================================

Novos recursos:
1) Banir / desbanir conta
2) Editar personagem + GM
3) Editar conta + VIP + prazo
4) Responder chamado
5) Mover personagem
6) Excluir conta
7) Desconectar usuário / forçar status offline
8) Alterar VIP
9) Inserir / editar WCoinC, WCoinP, GoblinPoint
10) Autorizar / revogar acesso admin
11) Extrato de saldo acima de zero

Mantém:
- Background Hero
- Background Index + fade
- Downloads
- Redes sociais
- Diagnóstico
=========================================================
*/

if(!defined('ADMIN_TICKET_FILE')){
    define('ADMIN_TICKET_FILE', dirname(__FILE__).'/dados/chamados.txt');
}

/* =========================================================
HELPERS
========================================================= */

function admin_sql($v){
    return str_replace("'", "''", trim($v));
}

function admin_redirect($msg,$type){
    header('Location: admin.php?msg='.urlencode($msg).'&type='.urlencode($type));
    exit;
}

function admin_account_exists($account){
    $q = @mssql_query("
        SELECT TOP 1 memb___id
        FROM MEMB_INFO
        WHERE memb___id='".admin_sql($account)."'
    ");
    if(!$q) return false;
    return mssql_fetch_assoc($q) ? true : false;
}

function admin_character_exists($account,$name){
    $q = @mssql_query("
        SELECT TOP 1 Name
        FROM Character
        WHERE AccountID='".admin_sql($account)."'
          AND Name='".admin_sql($name)."'
    ");
    if(!$q) return false;
    return mssql_fetch_assoc($q) ? true : false;
}

function admin_accounts(){
    $rows=array();
    $q=@mssql_query("
        SELECT
            memb___id,
            memb_name,
            mail_addr,
            AccountLevel,
            AccountExpireDate,
            bloc_code,
            Lock,
            level
        FROM MEMB_INFO
        ORDER BY memb___id ASC
    ");
    if($q){
        while($r=mssql_fetch_assoc($q)){
            $rows[]=$r;
        }
    }
    return $rows;
}

function admin_characters(){
    $rows=array();
    $q=@mssql_query("
        SELECT
            AccountID,Name,Class,cLevel,LevelUpPoint,
            Strength,Dexterity,Vitality,Energy,Leadership,
            Money,ResetCount,MasterResetCount,
            MapNumber,MapPosX,MapPosY,CtlCode,Kills,Deads
        FROM Character
        ORDER BY AccountID ASC,Name ASC
    ");
    if($q){
        while($r=mssql_fetch_assoc($q)){
            $rows[]=$r;
        }
    }
    return $rows;
}

function admin_online_users(){
    $rows=array();
    $q=@mssql_query("
        SELECT
            memb___id,
            ConnectStat,
            ServerName,
            IP,
            ConnectTM,
            OnlineHours
        FROM MEMB_STAT
        WHERE ConnectStat=1
        ORDER BY ConnectTM DESC
    ");
    if($q){
        while($r=mssql_fetch_assoc($q)){
            $rows[]=$r;
        }
    }
    return $rows;
}

function admin_balances(){
    $rows=array();
    $q=@mssql_query("
        SELECT
            c.AccountID,
            ISNULL(c.WCoinC,0) AS WCoinC,
            ISNULL(c.WCoinP,0) AS WCoinP,
            ISNULL(c.GoblinPoint,0) AS GoblinPoint
        FROM CashShopData c
        WHERE
            ISNULL(c.WCoinC,0)>0
            OR ISNULL(c.WCoinP,0)>0
            OR ISNULL(c.GoblinPoint,0)>0
        ORDER BY
            (ISNULL(c.WCoinC,0)+ISNULL(c.WCoinP,0)+ISNULL(c.GoblinPoint,0)) DESC,
            c.AccountID ASC
    ");
    if($q){
        while($r=mssql_fetch_assoc($q)){
            $rows[]=$r;
        }
    }
    return $rows;
}

function admin_balance_account($account){
    $out=array('WCoinC'=>0,'WCoinP'=>0,'GoblinPoint'=>0);
    $q=@mssql_query("
        SELECT TOP 1
            ISNULL(WCoinC,0) AS WCoinC,
            ISNULL(WCoinP,0) AS WCoinP,
            ISNULL(GoblinPoint,0) AS GoblinPoint
        FROM CashShopData
        WHERE AccountID='".admin_sql($account)."'
    ");
    if($q){
        $r=mssql_fetch_assoc($q);
        if($r) return $r;
    }
    return $out;
}

function admin_ticket_rows(){
    $rows=array();

    if(!file_exists(ADMIN_TICKET_FILE)){
        return $rows;
    }

    $fp=@fopen(ADMIN_TICKET_FILE,'r');
    if(!$fp){
        return $rows;
    }

    while(!feof($fp)){
        $line=trim(fgets($fp));
        if($line=='') continue;

        $d=explode('|',$line);

        if(count($d)<8){
            continue;
        }

        $rows[]=array(
            'id'=>$d[0],
            'account'=>$d[1],
            'setor'=>$d[2],
            'assunto'=>base64_decode($d[3]),
            'mensagem'=>base64_decode($d[4]),
            'status'=>$d[5],
            'data'=>$d[6],
            'resposta'=>base64_decode($d[7])
        );
    }

    fclose($fp);

    return array_reverse($rows);
}

function admin_ticket_reply($ticketId,$reply){
    if(!file_exists(ADMIN_TICKET_FILE)){
        return false;
    }

    $lines=@file(ADMIN_TICKET_FILE,FILE_IGNORE_NEW_LINES);

    if(!$lines){
        return false;
    }

    $found=false;
    $new=array();

    foreach($lines as $line){
        $line=trim($line);

        if($line==''){
            continue;
        }

        $d=explode('|',$line);

        if(count($d)<8){
            $new[]=$line;
            continue;
        }

        if($d[0]==$ticketId){
            $d[5]='respondido';
            $d[7]=base64_encode($reply);
            $line=implode('|',$d);
            $found=true;
        }

        $new[]=$line;
    }

    if(!$found){
        return false;
    }

    $fp=@fopen(ADMIN_TICKET_FILE,'c+');

    if(!$fp){
        return false;
    }

    if(!flock($fp,LOCK_EX)){
        fclose($fp);
        return false;
    }

    ftruncate($fp,0);
    rewind($fp);
    fwrite($fp,implode("\n",$new)."\n");
    fflush($fp);
    flock($fp,LOCK_UN);
    fclose($fp);

    return true;
}

function admin_class_options(){
    return array(
        0=>'Dark Wizard',
        1=>'Soul Master',
        2=>'Grand Master',
        16=>'Dark Knight',
        17=>'Blade Knight',
        18=>'Blade Master',
        32=>'Fairy Elf',
        33=>'Muse Elf',
        34=>'High Elf',
        48=>'Magic Gladiator',
        50=>'Duel Master',
        64=>'Dark Lord',
        66=>'Lord Emperor',
        80=>'Summoner',
        81=>'Bloody Summoner',
        82=>'Dimension Master',
        96=>'Rage Fighter',
        98=>'Fist Master'
    );
}

function admin_vip_name($level){
    $level=intval($level);
    if($level==1) return 'VIP 1';
    if($level==2) return 'VIP 2';
    if($level==3) return 'VIP 3';
    return 'Free';
}

function admin_is_banned($row){
    if(isset($row['Lock']) && intval($row['Lock'])===1){
        return true;
    }

    if(isset($row['bloc_code'])){
        $v=strtoupper(trim($row['bloc_code']));
        if($v=='1' || $v=='Y'){
            return true;
        }
    }

    return false;
}

/* =========================================================
POST ACTIONS
========================================================= */

if($_SERVER['REQUEST_METHOD']=='POST' && isset($_POST['acao'])){

    if(!validar_csrf()){
        $erro='Sessão expirada. Atualize a página e tente novamente.';
    }
    else{

        $acao=$_POST['acao'];

        /* -------------------------------------------------
        FUNÇÕES EXISTENTES
        ------------------------------------------------- */

        if($acao=='hero_upload'){
            $r=upload_image_generic('hero_image','hero');

            if($r[0]){
                write_text_file('hero_background.txt',$r[1]);
                $msg=t('success_saved');
            }
            else{
                $erro=$r[1];
            }
        }

        elseif($acao=='hero_path'){
            $v=isset($_POST['hero_path'])?trim($_POST['hero_path']):'';

            if($v==''){
                $erro=t('fill_fields');
            }
            else{
                write_text_file('hero_background.txt',$v);
                $msg=t('success_saved');
            }
        }

        elseif($acao=='index_save'){

            $cfg=index_bg_config();

            $mode=isset($_POST['mode']) && $_POST['mode']=='image'
                ? 'image'
                : 'gradient';

            $cfg['mode']=$mode;

            $cfg['color1']=safe_hex(
                isset($_POST['color1'])?$_POST['color1']:'',
                '#090816'
            );

            $cfg['color2']=safe_hex(
                isset($_POST['color2'])?$_POST['color2']:'',
                '#17102b'
            );

            $cfg['fade']=isset($_POST['fade'])?intval($_POST['fade']):88;

            if($cfg['fade']<0) $cfg['fade']=0;
            if($cfg['fade']>100) $cfg['fade']=100;

            $path=isset($_POST['index_image_path'])
                ? trim($_POST['index_image_path'])
                : $cfg['image'];

            if(
                isset($_FILES['index_image']) &&
                intval($_FILES['index_image']['error'])===0
            ){
                $r=upload_image_generic('index_image','index');

                if($r[0]){
                    $path=$r[1];
                }
                else{
                    $erro=$r[1];
                }
            }

            $cfg['image']=$path;

            if($erro==''){
                write_kv_file('index_background.txt',$cfg);
                $msg=t('success_saved');
            }
        }

        elseif($acao=='download_save'){

            $id=isset($_POST['download_id'])?trim($_POST['download_id']):'';
            $name=isset($_POST['download_name'])?trim($_POST['download_name']):'';
            $desc=isset($_POST['download_description'])?trim($_POST['download_description']):'';
            $link=isset($_POST['download_link'])?trim($_POST['download_link']):'';
            $size=isset($_POST['download_size'])?trim($_POST['download_size']):'';

            if($name=='' || $desc=='' || $link=='' || $size==''){
                $erro=t('fill_fields');
            }
            else{

                $rows=get_downloads();
                $found=false;

                if($id==''){
                    $id='d'.date('YmdHis').mt_rand(100,999);
                }

                for($i=0;$i<count($rows);$i++){

                    if($rows[$i]['id']==$id){

                        $rows[$i]=array(
                            'id'=>$id,
                            'name'=>$name,
                            'description'=>$desc,
                            'link'=>$link,
                            'size'=>$size
                        );

                        $found=true;
                        break;
                    }
                }

                if(!$found){
                    $rows[]=array(
                        'id'=>$id,
                        'name'=>$name,
                        'description'=>$desc,
                        'link'=>$link,
                        'size'=>$size
                    );
                }

                if(save_downloads($rows)){
                    $msg=t('success_saved');
                }
                else{
                    $erro=t('upload_fail');
                }
            }
        }

        elseif($acao=='download_delete'){

            $id=isset($_POST['download_id'])?trim($_POST['download_id']):'';
            $rows=get_downloads();
            $new=array();

            foreach($rows as $r){
                if($r['id']!=$id){
                    $new[]=$r;
                }
            }

            if(save_downloads($new)){
                $msg=t('success_saved');
            }
            else{
                $erro=t('upload_fail');
            }
        }

        elseif($acao=='social_save'){

            $socials=social_defaults();

            foreach($socials as $k=>$v){

                $socials[$k]['enabled']=
                    isset($_POST['social_enabled_'.$k])
                    ? 1
                    : 0;

                $socials[$k]['url']=
                    isset($_POST['social_url_'.$k])
                    ? trim($_POST['social_url_'.$k])
                    : '';
            }

            if(save_socials($socials)){
                $msg=t('success_saved');
            }
            else{
                $erro=t('upload_fail');
            }
        }

        /* -------------------------------------------------
        1 - BANIR / DESBANIR CONTA
        ------------------------------------------------- */

        elseif($acao=='account_ban'){

            $account=isset($_POST['account'])?trim($_POST['account']):'';
            $mode=isset($_POST['ban_mode'])?trim($_POST['ban_mode']):'ban';

            if(!admin_account_exists($account)){
                $erro='Conta não encontrada.';
            }
            else{

                if($mode=='unban'){

                    $ok=@mssql_query("
                        UPDATE MEMB_INFO
                        SET Lock=0, bloc_code='0'
                        WHERE memb___id='".admin_sql($account)."'
                    ");

                    if($ok){
                        $msg='Conta '.$account.' desbloqueada.';
                    }
                    else{
                        $erro='Não foi possível desbloquear a conta.';
                    }
                }
                else{

                    $ok=@mssql_query("
                        UPDATE MEMB_INFO
                        SET Lock=1, bloc_code='1'
                        WHERE memb___id='".admin_sql($account)."'
                    ");

                    if($ok){
                        $msg='Conta '.$account.' banida.';
                    }
                    else{
                        $erro='Não foi possível banir a conta.';
                    }
                }
            }
        }

        /* -------------------------------------------------
        2 - EDITAR PERSONAGEM
        ------------------------------------------------- */

        elseif($acao=='character_edit'){

            $account=isset($_POST['char_account'])?trim($_POST['char_account']):'';
            $name=isset($_POST['char_name'])?trim($_POST['char_name']):'';

            if(!admin_character_exists($account,$name)){
                $erro='Personagem não encontrado.';
            }
            else{

                $class=intval($_POST['char_class']);
                $level=max(1,intval($_POST['char_level']));
                $resets=max(0,intval($_POST['char_resets']));
                $mresets=max(0,intval($_POST['char_mresets']));
                $points=max(0,intval($_POST['char_points']));
                $str=max(0,intval($_POST['char_strength']));
                $dex=max(0,intval($_POST['char_dexterity']));
                $vit=max(0,intval($_POST['char_vitality']));
                $ene=max(0,intval($_POST['char_energy']));
                $cmd=max(0,intval($_POST['char_leadership']));
                $money=max(0,intval($_POST['char_money']));
                $ctl=intval($_POST['char_ctlcode']);

                $ok=@mssql_query("
                    UPDATE Character SET
                        Class=".$class.",
                        cLevel=".$level.",
                        ResetCount=".$resets.",
                        MasterResetCount=".$mresets.",
                        LevelUpPoint=".$points.",
                        Strength=".$str.",
                        Dexterity=".$dex.",
                        Vitality=".$vit.",
                        Energy=".$ene.",
                        Leadership=".$cmd.",
                        Money=".$money.",
                        CtlCode=".$ctl."
                    WHERE AccountID='".admin_sql($account)."'
                      AND Name='".admin_sql($name)."'
                ");

                if($ok){
                    $msg='Personagem '.$name.' atualizado.';
                }
                else{
                    $erro='Não foi possível editar o personagem.';
                }
            }
        }

        /* -------------------------------------------------
        3 - EDITAR CONTA + VIP + PRAZO
        ------------------------------------------------- */

        elseif($acao=='account_edit'){

            $account=isset($_POST['edit_account'])?trim($_POST['edit_account']):'';

            if(!admin_account_exists($account)){
                $erro='Conta não encontrada.';
            }
            else{

                $name=isset($_POST['edit_name'])?trim($_POST['edit_name']):'';
                $email=isset($_POST['edit_email'])?trim($_POST['edit_email']):'';
                $password=isset($_POST['edit_password'])?trim($_POST['edit_password']):'';
                $vip=max(0,min(3,intval($_POST['edit_vip'])));
                $expire=isset($_POST['edit_expire'])?trim($_POST['edit_expire']):'';

                if(strlen($name)>10){
                    $erro='Nome da conta: máximo 10 caracteres.';
                }
                elseif(strlen($email)>50){
                    $erro='E-mail: máximo 50 caracteres.';
                }
                elseif($password!='' && strlen($password)>10){
                    $erro='Senha: máximo 10 caracteres.';
                }
                else{

                    $sql="
                        UPDATE MEMB_INFO SET
                            memb_name='".admin_sql($name)."',
                            mail_addr='".admin_sql($email)."',
                            AccountLevel=".$vip;

                    if($password!=''){
                        $sql.=", memb__pwd='".admin_sql($password)."'";
                    }

                    if($expire!=''){
                        $sql.=", AccountExpireDate='".admin_sql($expire)."'";
                    }

                    $sql.=" WHERE memb___id='".admin_sql($account)."'";

                    $ok=@mssql_query($sql);

                    if($ok){
                        $msg='Conta '.$account.' atualizada.';
                    }
                    else{
                        $erro='Não foi possível editar a conta.';
                    }
                }
            }
        }

        /* -------------------------------------------------
        4 - RESPONDER CHAMADO
        ------------------------------------------------- */

        elseif($acao=='ticket_reply'){

            $ticket=isset($_POST['ticket_id'])?trim($_POST['ticket_id']):'';
            $reply=isset($_POST['ticket_reply'])?trim($_POST['ticket_reply']):'';

            if($ticket=='' || $reply==''){
                $erro='Selecione o chamado e informe a resposta.';
            }
            elseif(admin_ticket_reply($ticket,$reply)){
                $msg='Chamado respondido com sucesso.';
            }
            else{
                $erro='Não foi possível responder o chamado.';
            }
        }

        /* -------------------------------------------------
        5 - MOVER PERSONAGEM
        ------------------------------------------------- */

        elseif($acao=='character_move'){

            $account=isset($_POST['move_account'])?trim($_POST['move_account']):'';
            $name=isset($_POST['move_name'])?trim($_POST['move_name']):'';

            if(!admin_character_exists($account,$name)){
                $erro='Personagem não encontrado.';
            }
            else{

                $map=max(0,intval($_POST['move_map']));
                $x=max(0,intval($_POST['move_x']));
                $y=max(0,intval($_POST['move_y']));

                $ok=@mssql_query("
                    UPDATE Character SET
                        MapNumber=".$map.",
                        MapPosX=".$x.",
                        MapPosY=".$y."
                    WHERE AccountID='".admin_sql($account)."'
                      AND Name='".admin_sql($name)."'
                ");

                if($ok){
                    $msg='Personagem '.$name.' movido para mapa '.$map.' ('.$x.', '.$y.').';
                }
                else{
                    $erro='Não foi possível mover o personagem.';
                }
            }
        }

        /* -------------------------------------------------
        6 - EXCLUIR CONTA
        ------------------------------------------------- */

        elseif($acao=='account_delete'){

            $account=isset($_POST['delete_account'])?trim($_POST['delete_account']):'';
            $confirm=isset($_POST['delete_confirm'])?trim($_POST['delete_confirm']):'';

            if(!admin_account_exists($account)){
                $erro='Conta não encontrada.';
            }
            elseif($confirm!=$account){
                $erro='Digite exatamente o login da conta para confirmar.';
            }
            else{

                @mssql_query("BEGIN TRANSACTION");

                $ok1=@mssql_query("
                    DELETE FROM Character
                    WHERE AccountID='".admin_sql($account)."'
                ");

                @mssql_query("
                    DELETE FROM CashShopData
                    WHERE AccountID='".admin_sql($account)."'
                ");

                @mssql_query("
                    DELETE FROM MEMB_STAT
                    WHERE memb___id='".admin_sql($account)."'
                ");

                @mssql_query("
                    DELETE FROM AccountCharacter
                    WHERE Id='".admin_sql($account)."'
                ");

                @mssql_query("
                    DELETE FROM warehouse
                    WHERE AccountID='".admin_sql($account)."'
                ");

                $ok2=@mssql_query("
                    DELETE FROM MEMB_INFO
                    WHERE memb___id='".admin_sql($account)."'
                ");

                if($ok1!==false && $ok2!==false){
                    @mssql_query("COMMIT TRANSACTION");
                    $msg='Conta '.$account.' excluída.';
                }
                else{
                    @mssql_query("ROLLBACK TRANSACTION");
                    $erro='A exclusão não pôde ser concluída.';
                }
            }
        }

        /* -------------------------------------------------
        7 - DESCONECTAR / FORÇAR STATUS OFFLINE
        ------------------------------------------------- */

        elseif($acao=='disconnect_user'){

            $account=isset($_POST['disconnect_account'])?trim($_POST['disconnect_account']):'';

            $ok=@mssql_query("
                UPDATE MEMB_STAT SET
                    ConnectStat=0,
                    DisConnectTM=GETDATE()
                WHERE memb___id='".admin_sql($account)."'
            ");

            if($ok){
                $msg='Status de '.$account.' alterado para offline. Observação: isto atualiza a MEMB_STAT; o kick físico do cliente depende do GameServer/ConnectServer possuir integração de desconexão.';
            }
            else{
                $erro='Não foi possível alterar o status do usuário.';
            }
        }

        /* -------------------------------------------------
        8 - ALTERAR VIP
        ------------------------------------------------- */

        elseif($acao=='vip_edit'){

            $account=isset($_POST['vip_account'])?trim($_POST['vip_account']):'';
            $vip=max(0,min(3,intval($_POST['vip_level'])));
            $expire=isset($_POST['vip_expire'])?trim($_POST['vip_expire']):'';

            if(!admin_account_exists($account)){
                $erro='Conta não encontrada.';
            }
            elseif($expire==''){
                $erro='Informe a data de expiração.';
            }
            else{

                $ok=@mssql_query("
                    UPDATE MEMB_INFO SET
                        AccountLevel=".$vip.",
                        AccountExpireDate='".admin_sql($expire)."'
                    WHERE memb___id='".admin_sql($account)."'
                ");

                if($ok){
                    $msg='VIP da conta '.$account.' atualizado.';
                }
                else{
                    $erro='Não foi possível atualizar o VIP.';
                }
            }
        }

        /* -------------------------------------------------
        9 - SALDOS
        ------------------------------------------------- */

        elseif($acao=='balance_edit'){

            $account=isset($_POST['balance_account'])?trim($_POST['balance_account']):'';
            $wcoinc=max(0,intval($_POST['balance_wcoinc']));
            $wcoinp=max(0,intval($_POST['balance_wcoinp']));
            $goblin=max(0,intval($_POST['balance_goblin']));

            if(!admin_account_exists($account)){
                $erro='Conta não encontrada.';
            }
            else{

                $q=@mssql_query("
                    SELECT TOP 1 AccountID
                    FROM CashShopData
                    WHERE AccountID='".admin_sql($account)."'
                ");

                $exists=$q && mssql_fetch_assoc($q);

                if($exists){

                    $ok=@mssql_query("
                        UPDATE CashShopData SET
                            WCoinC=".$wcoinc.",
                            WCoinP=".$wcoinp.",
                            GoblinPoint=".$goblin."
                        WHERE AccountID='".admin_sql($account)."'
                    ");
                }
                else{

                    $ok=@mssql_query("
                        INSERT INTO CashShopData
                            (AccountID,WCoinC,WCoinP,GoblinPoint)
                        VALUES
                            ('".admin_sql($account)."',".$wcoinc.",".$wcoinp.",".$goblin.")
                    ");
                }

                if($ok){
                    $msg='Saldo da conta '.$account.' atualizado.';
                }
                else{
                    $erro='Não foi possível atualizar o saldo.';
                }
            }
        }

        /* -------------------------------------------------
        10 - AUTORIZAR ADMIN
        ------------------------------------------------- */

        elseif($acao=='admin_access'){

            $account=isset($_POST['admin_account'])?trim($_POST['admin_account']):'';
            $allow=isset($_POST['admin_allow'])?intval($_POST['admin_allow']):0;

            if(!admin_account_exists($account)){
                $erro='Conta não encontrada.';
            }
            else{

                $ok=@mssql_query("
                    UPDATE MEMB_INFO
                    SET level=".($allow===1?1:0)."
                    WHERE memb___id='".admin_sql($account)."'
                ");

                if($ok){
                    $msg=$allow===1
                        ? 'Acesso administrativo autorizado para '.$account.'.'
                        : 'Acesso administrativo removido de '.$account.'.';
                }
                else{
                    $erro='Não foi possível alterar o acesso administrativo.';
                }
            }
        }
    }
}

/* =========================================================
DADOS
========================================================= */

if(isset($_GET['msg']) && $_GET['msg']!=''){
    $msg=$_GET['msg'];
}
if(isset($_GET['type']) && $_GET['type']=='error' && $msg!=''){
    $erro=$msg;
    $msg='';
}

$indexCfg=index_bg_config();
$downloads=get_downloads();
$socials=get_socials();

$accounts=admin_accounts();
$characters=admin_characters();
$onlineUsers=admin_online_users();
$balances=admin_balances();
$tickets=admin_ticket_rows();
$classes=admin_class_options();

$totalAccounts=count($accounts);
$totalCharacters=count($characters);
$totalOnline=count($onlineUsers);
$totalTickets=0;

foreach($tickets as $tk){
    if($tk['status']!='respondido'){
        $totalTickets++;
    }
}

include('includes/header.php');
?>

<style type="text/css">
.admin-hero{display:flex;justify-content:space-between;gap:20px;align-items:flex-end;margin-bottom:22px}
.admin-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:20px 0 26px}
.admin-kpi{padding:18px}
.admin-kpi small{display:block;color:#8fa0b6;margin-bottom:8px}
.admin-kpi strong{font-size:26px}
.admin-tools{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.admin-tool{border:1px solid rgba(127,112,255,.22);background:rgba(10,15,27,.84);border-radius:18px;padding:18px;text-align:left;color:#fff;cursor:pointer;transition:.2s;min-height:126px}
.admin-tool:hover{transform:translateY(-3px);border-color:#56dfff;box-shadow:0 14px 38px rgba(0,210,255,.09)}
.admin-tool-icon{display:flex;width:36px;height:36px;align-items:center;justify-content:center;border-radius:11px;background:rgba(100,82,255,.15);color:#8ee9ff;margin-bottom:12px;font-weight:bold}
.admin-tool b{display:block;margin-bottom:7px;font-size:14px}
.admin-tool small{display:block;color:#8fa0b5;line-height:1.45}
.admin-group-title{margin:30px 0 13px;display:flex;align-items:center;gap:10px}
.admin-group-title:after{content:"";height:1px;background:rgba(255,255,255,.08);flex:1}
.admin-modal{display:none;position:fixed;z-index:999999;left:0;top:0;width:100%;height:100%;overflow:auto;background:rgba(1,4,12,.82);backdrop-filter:blur(10px)}
.admin-modal.open{display:block}
.admin-modal-box{width:calc(100% - 32px);max-width:760px;margin:4vh auto;background:linear-gradient(150deg,rgba(17,23,39,.99),rgba(6,9,17,.99));border:1px solid rgba(90,218,255,.22);border-radius:24px;box-shadow:0 30px 110px rgba(0,0,0,.55);overflow:hidden}
.admin-modal-box.wide{max-width:1080px}
.admin-modal-head{padding:19px 22px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between;gap:15px}
.admin-modal-head h2{margin:0;font-size:19px}
.admin-modal-close{border:0;background:none;color:#aebbd0;font-size:29px;cursor:pointer}
.admin-modal-body{padding:22px}
.admin-form label{display:block;color:#9aabc0;font-size:12px;margin:13px 0 6px}
.admin-form input,.admin-form select,.admin-form textarea{width:100%;box-sizing:border-box;padding:12px 13px;border-radius:12px;border:1px solid rgba(130,150,185,.2);background:#0a101b;color:#fff;outline:none}
.admin-form textarea{min-height:120px;resize:vertical}
.admin-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.admin-form-grid.three{grid-template-columns:repeat(3,1fr)}
.admin-full{grid-column:1/-1}
.admin-btn{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:12px;padding:12px 17px;background:linear-gradient(90deg,#725aff,#1dcdeb);color:#fff;font-weight:bold;cursor:pointer;margin-top:17px;text-decoration:none}
.admin-btn.danger{background:linear-gradient(90deg,#b42f58,#ff5f59)}
.admin-btn.gray{background:#171f2e}
.admin-note{padding:12px 14px;border-radius:12px;background:rgba(255,184,54,.07);border:1px solid rgba(255,184,54,.2);color:#eacb86;font-size:12px;line-height:1.55;margin-bottom:15px}
.admin-table-wrap{overflow:auto;border:1px solid rgba(255,255,255,.07);border-radius:15px}
.admin-table2{width:100%;border-collapse:collapse;min-width:720px}
.admin-table2 th,.admin-table2 td{padding:11px 12px;border-bottom:1px solid rgba(255,255,255,.06);text-align:left;font-size:12px}
.admin-table2 th{color:#8fa1b8;background:rgba(255,255,255,.025)}
.admin-table2 td{color:#dbe5f2}
.admin-status{display:inline-block;padding:5px 9px;border-radius:20px;background:rgba(49,216,157,.09);color:#69e5b8;font-size:11px}
.admin-status.bad{background:rgba(255,79,107,.09);color:#ff8ea1}
.admin-alert{padding:13px 16px;border-radius:13px;margin:14px 0}
.admin-alert.ok{background:rgba(53,219,160,.1);border:1px solid rgba(53,219,160,.24);color:#78e9c1}
.admin-alert.bad{background:rgba(255,83,111,.1);border:1px solid rgba(255,83,111,.24);color:#ff9bad}
.admin-preview{height:180px;border-radius:17px;background-size:cover;background-position:center;border:1px solid rgba(255,255,255,.08);margin-bottom:15px}
.admin-download-row,.admin-ticket-row{border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:13px;margin:10px 0}
.admin-actions-row{display:flex;gap:8px;flex-wrap:wrap}
.admin-mini-btn{border:0;border-radius:9px;padding:8px 10px;background:#172031;color:#dce7f5;cursor:pointer;font-size:11px;text-decoration:none}
.admin-mini-btn.danger{background:#3a1720;color:#ff9aaa}
@media(max-width:1100px){.admin-tools{grid-template-columns:repeat(3,1fr)}.admin-kpis{grid-template-columns:repeat(2,1fr)}}
@media(max-width:760px){.admin-tools{grid-template-columns:repeat(2,1fr)}.admin-form-grid,.admin-form-grid.three{grid-template-columns:1fr}}
@media(max-width:480px){.admin-tools,.admin-kpis{grid-template-columns:1fr}.admin-hero{display:block}}
</style>

<div class="admin-hero">
    <div class="page-head" style="margin-bottom:0">
        <span class="eyebrow">CENTRAL ADMINISTRATIVA</span>
        <h1>Controle do servidor</h1>
        <p>Contas, personagens, VIP, moedas, suporte e configurações do portal.</p>
    </div>
</div>

<?php if($msg!=''){ ?>
<div class="admin-alert ok"><?php echo h($msg); ?></div>
<?php } ?>

<?php if($erro!=''){ ?>
<div class="admin-alert bad"><?php echo h($erro); ?></div>
<?php } ?>

<section class="admin-kpis">
    <div class="panel admin-kpi"><small>Contas cadastradas</small><strong><?php echo intval($totalAccounts); ?></strong></div>
    <div class="panel admin-kpi"><small>Personagens</small><strong><?php echo intval($totalCharacters); ?></strong></div>
    <div class="panel admin-kpi"><small>Usuários online</small><strong><?php echo intval($totalOnline); ?></strong></div>
    <div class="panel admin-kpi"><small>Chamados aguardando</small><strong><?php echo intval($totalTickets); ?></strong></div>
</section>

<div class="admin-group-title"><span class="eyebrow">SERVIDOR E USUÁRIOS</span></div>

<section class="admin-tools">

<button type="button" class="admin-tool" onclick="adminOpen('modalBan')">
<span class="admin-tool-icon">!</span><b>Banir / desbanir conta</b><small>Bloqueia ou libera o acesso de uma conta.</small>
</button>

<button type="button" class="admin-tool" onclick="adminOpen('modalCharacter')">
<span class="admin-tool-icon">♟</span><b>Editar personagem</b><small>Level, resets, atributos, classe e Game Master.</small>
</button>

<button type="button" class="admin-tool" onclick="adminOpen('modalAccount')">
<span class="admin-tool-icon">A</span><b>Editar conta</b><small>Nome, e-mail, senha, VIP e expiração.</small>
</button>

<button type="button" class="admin-tool" onclick="adminOpen('modalTickets')">
<span class="admin-tool-icon">?</span><b>Responder chamados</b><small>Suporte, financeiro e denúncias.</small>
</button>

<button type="button" class="admin-tool" onclick="adminOpen('modalMove')">
<span class="admin-tool-icon">→</span><b>Mover personagem</b><small>Altera mapa e coordenadas X/Y.</small>
</button>

<button type="button" class="admin-tool" onclick="adminOpen('modalDeleteAccount')">
<span class="admin-tool-icon">×</span><b>Excluir conta</b><small>Remove conta e dados vinculados principais.</small>
</button>

<button type="button" class="admin-tool" onclick="adminOpen('modalDisconnect')">
<span class="admin-tool-icon">↯</span><b>Desconectar usuário</b><small>Lista contas online e força MEMB_STAT para offline.</small>
</button>

<button type="button" class="admin-tool" onclick="adminOpen('modalVip')">
<span class="admin-tool-icon">◆</span><b>Alterar VIP</b><small>Nível VIP e data de expiração.</small>
</button>

<button type="button" class="admin-tool" onclick="adminOpen('modalBalance')">
<span class="admin-tool-icon">$</span><b>Saldo / moedas</b><small>WCoinC, WCoinP e GoblinPoint.</small>
</button>

<button type="button" class="admin-tool" onclick="adminOpen('modalAdminAccess')">
<span class="admin-tool-icon">⚙</span><b>Acesso ao painel Admin</b><small>Autoriza ou remove administrador do site.</small>
</button>

<button type="button" class="admin-tool" onclick="adminOpen('modalStatement')">
<span class="admin-tool-icon">≡</span><b>Extrato de saldo</b><small>Contas com qualquer moeda acima de zero.</small>
</button>

</section>

<div class="admin-group-title"><span class="eyebrow">PORTAL E CONTEÚDO</span></div>

<section class="admin-tools">

<button type="button" class="admin-tool" onclick="adminOpen('modalHero')">
<span class="admin-tool-icon">▣</span><b>Background Hero</b><small>Imagem do panel hero-card da página inicial.</small>
</button>

<button type="button" class="admin-tool" onclick="adminOpen('modalIndexBg')">
<span class="admin-tool-icon">◐</span><b>Background da Index</b><small>Imagem, gradiente, cores e intensidade do fade.</small>
</button>

<button type="button" class="admin-tool" onclick="adminOpen('modalDownloads')">
<span class="admin-tool-icon">↓</span><b>Gerenciar downloads</b><small>Adicionar, editar e excluir downloads.</small>
</button>

<button type="button" class="admin-tool" onclick="adminOpen('modalSocial')">
<span class="admin-tool-icon">@</span><b>Redes sociais</b><small>Ativar, desativar e alterar os links.</small>
</button>

<button type="button" class="admin-tool" onclick="adminOpen('modalDiagnostic')">
<span class="admin-tool-icon">✓</span><b>Diagnóstico</b><small>PHP, MSSQL, conexão e configurações atuais.</small>
</button>

</section>

<?php
/* =========================================================
REUTILIZÁVEIS DE SELECT
========================================================= */
function admin_account_options($accounts){
    foreach($accounts as $a){
        echo '<option value="'.h($a['memb___id']).'">'.h($a['memb___id']).'</option>';
    }
}

function admin_character_options($characters){
    foreach($characters as $c){
        echo '<option value="'.h($c['AccountID']).'|'.h($c['Name']).'">'.h($c['AccountID']).' / '.h($c['Name']).'</option>';
    }
}

$csrf=csrf_token();
?>

<!-- ======================================================
1 BANIR / DESBANIR
====================================================== -->
<div class="admin-modal" id="modalBan"><div class="admin-modal-box">
<div class="admin-modal-head"><h2>Banir / desbanir conta</h2><button type="button" class="admin-modal-close" onclick="adminClose('modalBan')">&times;</button></div>
<div class="admin-modal-body">
<form method="post" class="admin-form">
<input type="hidden" name="csrf" value="<?php echo h($csrf); ?>"/>
<input type="hidden" name="acao" value="account_ban"/>
<label>Conta</label>
<select name="account"><?php admin_account_options($accounts); ?></select>
<label>Ação</label>
<select name="ban_mode"><option value="ban">Banir conta</option><option value="unban">Desbanir conta</option></select>
<button type="submit" class="admin-btn danger">Executar</button>
</form>
</div></div></div>

<!-- ======================================================
2 EDITAR PERSONAGEM
====================================================== -->
<div class="admin-modal" id="modalCharacter"><div class="admin-modal-box wide">
<div class="admin-modal-head"><h2>Editar personagem</h2><button type="button" class="admin-modal-close" onclick="adminClose('modalCharacter')">&times;</button></div>
<div class="admin-modal-body">
<div class="admin-note">Selecione um personagem. Os campos abaixo serão carregados automaticamente pelo JavaScript com os dados já exibidos nesta página.</div>
<form method="post" class="admin-form">
<input type="hidden" name="csrf" value="<?php echo h($csrf); ?>"/>
<input type="hidden" name="acao" value="character_edit"/>
<label>Personagem</label>
<select id="charEditorSelect" onchange="adminLoadCharacter(this.value)">
<option value="">Selecione...</option>
<?php foreach($characters as $i=>$c){ ?>
<option value="<?php echo intval($i); ?>"><?php echo h($c['AccountID'].' / '.$c['Name']); ?></option>
<?php } ?>
</select>

<input type="hidden" name="char_account" id="char_account"/>
<input type="hidden" name="char_name" id="char_name"/>

<div class="admin-form-grid three">
<div><label>Classe</label><select name="char_class" id="char_class"><?php foreach($classes as $cid=>$cn){ ?><option value="<?php echo intval($cid); ?>"><?php echo h($cn); ?> (<?php echo intval($cid); ?>)</option><?php } ?></select></div>
<div><label>Level</label><input name="char_level" id="char_level"/></div>
<div><label>LevelUpPoint</label><input name="char_points" id="char_points"/></div>
<div><label>Resets</label><input name="char_resets" id="char_resets"/></div>
<div><label>Master Resets</label><input name="char_mresets" id="char_mresets"/></div>
<div><label>Zen</label><input name="char_money" id="char_money"/></div>
<div><label>Força</label><input name="char_strength" id="char_strength"/></div>
<div><label>Agilidade</label><input name="char_dexterity" id="char_dexterity"/></div>
<div><label>Vitalidade</label><input name="char_vitality" id="char_vitality"/></div>
<div><label>Energia</label><input name="char_energy" id="char_energy"/></div>
<div><label>Leadership</label><input name="char_leadership" id="char_leadership"/></div>
<div>
<label>Game Master / CtlCode</label>
<select name="char_ctlcode" id="char_ctlcode">
<option value="0">Jogador normal (0)</option>
<option value="8">Game Master (8)</option>
<option value="32">Administrador / GM (32)</option>
</select>
</div>
</div>
<button type="submit" class="admin-btn">Salvar personagem</button>
</form>
</div></div></div>

<!-- ======================================================
3 EDITAR CONTA
====================================================== -->
<div class="admin-modal" id="modalAccount"><div class="admin-modal-box">
<div class="admin-modal-head"><h2>Editar conta</h2><button type="button" class="admin-modal-close" onclick="adminClose('modalAccount')">&times;</button></div>
<div class="admin-modal-body">
<form method="post" class="admin-form">
<input type="hidden" name="csrf" value="<?php echo h($csrf); ?>"/>
<input type="hidden" name="acao" value="account_edit"/>
<label>Conta</label>
<select name="edit_account" id="accountEditorSelect" onchange="adminLoadAccount(this.value)">
<option value="">Selecione...</option>
<?php foreach($accounts as $i=>$a){ ?><option value="<?php echo intval($i); ?>"><?php echo h($a['memb___id']); ?></option><?php } ?>
</select>
<input type="hidden" name="edit_account" id="edit_account"/>
<div class="admin-form-grid">
<div><label>Nome</label><input name="edit_name" id="edit_name" maxlength="10"/></div>
<div><label>E-mail</label><input name="edit_email" id="edit_email" maxlength="50"/></div>
<div><label>Nova senha</label><input type="password" name="edit_password" maxlength="10" placeholder="Deixe vazio para manter"/></div>
<div><label>VIP</label><select name="edit_vip" id="edit_vip"><option value="0">Free</option><option value="1">VIP 1</option><option value="2">VIP 2</option><option value="3">VIP 3</option></select></div>
<div class="admin-full"><label>Data de expiração</label><input type="text" name="edit_expire" id="edit_expire" placeholder="2026-12-31 23:59:59"/></div>
</div>
<button type="submit" class="admin-btn">Salvar conta</button>
</form>
</div></div></div>

<!-- ======================================================
4 CHAMADOS
====================================================== -->
<div class="admin-modal" id="modalTickets"><div class="admin-modal-box wide">
<div class="admin-modal-head"><h2>Responder chamados</h2><button type="button" class="admin-modal-close" onclick="adminClose('modalTickets')">&times;</button></div>
<div class="admin-modal-body">

<?php if(!count($tickets)){ ?><div class="admin-note">Nenhum chamado encontrado.</div><?php } ?>

<?php foreach($tickets as $tk){ ?>
<div class="admin-ticket-row">
<div style="display:flex;justify-content:space-between;gap:10px">
<strong>#<?php echo h($tk['id']); ?> · <?php echo h($tk['account']); ?> · <?php echo h($tk['assunto']); ?></strong>
<span class="admin-status <?php echo $tk['status']=='respondido'?'':'bad'; ?>"><?php echo h($tk['status']); ?></span>
</div>
<small><?php echo h($tk['setor'].' · '.$tk['data']); ?></small>
<p><?php echo nl2br(h($tk['mensagem'])); ?></p>
<?php if($tk['resposta']!=''){ ?><div class="admin-note"><b>Resposta atual:</b><br/><?php echo nl2br(h($tk['resposta'])); ?></div><?php } ?>
<form method="post" class="admin-form">
<input type="hidden" name="csrf" value="<?php echo h($csrf); ?>"/>
<input type="hidden" name="acao" value="ticket_reply"/>
<input type="hidden" name="ticket_id" value="<?php echo h($tk['id']); ?>"/>
<label>Resposta</label>
<textarea name="ticket_reply"><?php echo h($tk['resposta']); ?></textarea>
<button type="submit" class="admin-btn">Responder chamado</button>
</form>
</div>
<?php } ?>

</div></div></div>

<!-- ======================================================
5 MOVER PERSONAGEM
====================================================== -->
<div class="admin-modal" id="modalMove"><div class="admin-modal-box">
<div class="admin-modal-head"><h2>Mover personagem</h2><button type="button" class="admin-modal-close" onclick="adminClose('modalMove')">&times;</button></div>
<div class="admin-modal-body">
<form method="post" class="admin-form">
<input type="hidden" name="csrf" value="<?php echo h($csrf); ?>"/>
<input type="hidden" name="acao" value="character_move"/>
<label>Personagem</label>
<select id="moveCharSelect" onchange="adminLoadMove(this.value)">
<option value="">Selecione...</option>
<?php foreach($characters as $i=>$c){ ?><option value="<?php echo intval($i); ?>"><?php echo h($c['AccountID'].' / '.$c['Name']); ?></option><?php } ?>
</select>
<input type="hidden" name="move_account" id="move_account"/>
<input type="hidden" name="move_name" id="move_name"/>
<div class="admin-form-grid three">
<div><label>Mapa</label><input name="move_map" id="move_map"/></div>
<div><label>X</label><input name="move_x" id="move_x"/></div>
<div><label>Y</label><input name="move_y" id="move_y"/></div>
</div>
<button type="submit" class="admin-btn">Mover personagem</button>
</form>
</div></div></div>

<!-- ======================================================
6 EXCLUIR CONTA
====================================================== -->
<div class="admin-modal" id="modalDeleteAccount"><div class="admin-modal-box">
<div class="admin-modal-head"><h2>Excluir conta</h2><button type="button" class="admin-modal-close" onclick="adminClose('modalDeleteAccount')">&times;</button></div>
<div class="admin-modal-body">
<div class="admin-note">Atenção: esta operação remove a conta, personagens e registros principais relacionados. Faça backup do banco antes de utilizar.</div>
<form method="post" class="admin-form" onsubmit="return confirm('EXCLUIR DEFINITIVAMENTE esta conta?');">
<input type="hidden" name="csrf" value="<?php echo h($csrf); ?>"/>
<input type="hidden" name="acao" value="account_delete"/>
<label>Conta</label><select name="delete_account"><?php admin_account_options($accounts); ?></select>
<label>Digite novamente o login para confirmar</label><input name="delete_confirm"/>
<button type="submit" class="admin-btn danger">Excluir definitivamente</button>
</form>
</div></div></div>

<!-- ======================================================
7 ONLINE / DESCONECTAR
====================================================== -->
<div class="admin-modal" id="modalDisconnect"><div class="admin-modal-box wide">
<div class="admin-modal-head"><h2>Usuários online</h2><button type="button" class="admin-modal-close" onclick="adminClose('modalDisconnect')">&times;</button></div>
<div class="admin-modal-body">
<div class="admin-note">O botão abaixo altera <b>MEMB_STAT.ConnectStat</b> para 0. Isso corrige o status web. Para derrubar fisicamente a conexão do cliente, o GameServer/ConnectServer precisa possuir uma rotina de kick integrada ao site.</div>
<div class="admin-table-wrap">
<table class="admin-table2">
<thead><tr><th>Conta</th><th>Servidor</th><th>IP</th><th>Conectou</th><th>Horas</th><th>Ação</th></tr></thead>
<tbody>
<?php if(!count($onlineUsers)){ ?><tr><td colspan="6">Nenhum usuário online.</td></tr><?php } ?>
<?php foreach($onlineUsers as $on){ ?>
<tr>
<td><b><?php echo h($on['memb___id']); ?></b></td>
<td><?php echo h($on['ServerName']); ?></td>
<td><?php echo h($on['IP']); ?></td>
<td><?php echo h($on['ConnectTM']); ?></td>
<td><?php echo intval($on['OnlineHours']); ?></td>
<td>
<form method="post" onsubmit="return confirm('Alterar esta conta para offline?');">
<input type="hidden" name="csrf" value="<?php echo h($csrf); ?>"/>
<input type="hidden" name="acao" value="disconnect_user"/>
<input type="hidden" name="disconnect_account" value="<?php echo h($on['memb___id']); ?>"/>
<button type="submit" class="admin-mini-btn danger">Desconectar</button>
</form>
</td>
</tr>
<?php } ?>
</tbody>
</table>
</div>
</div></div></div>

<!-- ======================================================
8 VIP
====================================================== -->
<div class="admin-modal" id="modalVip"><div class="admin-modal-box">
<div class="admin-modal-head"><h2>Alterar VIP</h2><button type="button" class="admin-modal-close" onclick="adminClose('modalVip')">&times;</button></div>
<div class="admin-modal-body">
<form method="post" class="admin-form">
<input type="hidden" name="csrf" value="<?php echo h($csrf); ?>"/>
<input type="hidden" name="acao" value="vip_edit"/>
<label>Conta</label><select name="vip_account"><?php admin_account_options($accounts); ?></select>
<div class="admin-form-grid">
<div><label>Nível VIP</label><select name="vip_level"><option value="0">Free</option><option value="1">VIP 1</option><option value="2">VIP 2</option><option value="3">VIP 3</option></select></div>
<div><label>Expira em</label><input name="vip_expire" placeholder="2026-12-31 23:59:59"/></div>
</div>
<button type="submit" class="admin-btn">Atualizar VIP</button>
</form>
</div></div></div>

<!-- ======================================================
9 SALDO
====================================================== -->
<div class="admin-modal" id="modalBalance"><div class="admin-modal-box">
<div class="admin-modal-head"><h2>Inserir / editar saldo</h2><button type="button" class="admin-modal-close" onclick="adminClose('modalBalance')">&times;</button></div>
<div class="admin-modal-body">
<form method="post" class="admin-form">
<input type="hidden" name="csrf" value="<?php echo h($csrf); ?>"/>
<input type="hidden" name="acao" value="balance_edit"/>
<label>Conta</label>
<select name="balance_account" id="balanceAccountSelect" onchange="adminLoadBalance(this.value)">
<option value="">Selecione...</option>
<?php foreach($accounts as $i=>$a){ ?><option value="<?php echo intval($i); ?>"><?php echo h($a['memb___id']); ?></option><?php } ?>
</select>
<input type="hidden" name="balance_account" id="balance_account"/>
<div class="admin-form-grid three">
<div><label>WCoinC</label><input name="balance_wcoinc" id="balance_wcoinc" value="0"/></div>
<div><label>WCoinP</label><input name="balance_wcoinp" id="balance_wcoinp" value="0"/></div>
<div><label>GoblinPoint</label><input name="balance_goblin" id="balance_goblin" value="0"/></div>
</div>
<button type="submit" class="admin-btn">Salvar saldo</button>
</form>
</div></div></div>

<!-- ======================================================
10 ADMIN ACCESS
====================================================== -->
<div class="admin-modal" id="modalAdminAccess"><div class="admin-modal-box">
<div class="admin-modal-head"><h2>Acesso ao painel administrativo</h2><button type="button" class="admin-modal-close" onclick="adminClose('modalAdminAccess')">&times;</button></div>
<div class="admin-modal-body">
<div class="admin-note">Esta função utiliza <b>MEMB_INFO.level</b>: 1 = administrador, 0 = usuário.</div>
<form method="post" class="admin-form">
<input type="hidden" name="csrf" value="<?php echo h($csrf); ?>"/>
<input type="hidden" name="acao" value="admin_access"/>
<label>Conta</label><select name="admin_account"><?php admin_account_options($accounts); ?></select>
<label>Permissão</label><select name="admin_allow"><option value="1">Autorizar administrador</option><option value="0">Revogar administrador</option></select>
<button type="submit" class="admin-btn">Salvar permissão</button>
</form>
</div></div></div>

<!-- ======================================================
11 EXTRATO
====================================================== -->
<div class="admin-modal" id="modalStatement"><div class="admin-modal-box wide">
<div class="admin-modal-head"><h2>Extrato de saldo</h2><button type="button" class="admin-modal-close" onclick="adminClose('modalStatement')">&times;</button></div>
<div class="admin-modal-body">
<div class="admin-table-wrap">
<table class="admin-table2">
<thead><tr><th>Conta</th><th>WCoinC</th><th>WCoinP</th><th>GoblinPoint</th><th>Total nominal</th></tr></thead>
<tbody>
<?php if(!count($balances)){ ?><tr><td colspan="5">Nenhuma conta com saldo acima de zero.</td></tr><?php } ?>
<?php
$totalC=0;$totalP=0;$totalG=0;
foreach($balances as $b){
    $totalC+=intval($b['WCoinC']);
    $totalP+=intval($b['WCoinP']);
    $totalG+=intval($b['GoblinPoint']);
?>
<tr>
<td><b><?php echo h($b['AccountID']); ?></b></td>
<td><?php echo intval($b['WCoinC']); ?></td>
<td><?php echo intval($b['WCoinP']); ?></td>
<td><?php echo intval($b['GoblinPoint']); ?></td>
<td><?php echo intval($b['WCoinC'])+intval($b['WCoinP'])+intval($b['GoblinPoint']); ?></td>
</tr>
<?php } ?>
</tbody>
<tfoot><tr><th>TOTAL</th><th><?php echo intval($totalC); ?></th><th><?php echo intval($totalP); ?></th><th><?php echo intval($totalG); ?></th><th><?php echo intval($totalC+$totalP+$totalG); ?></th></tr></tfoot>
</table>
</div>
</div></div></div>

<!-- ======================================================
HERO
====================================================== -->
<div class="admin-modal" id="modalHero"><div class="admin-modal-box">
<div class="admin-modal-head"><h2>Background Hero</h2><button type="button" class="admin-modal-close" onclick="adminClose('modalHero')">&times;</button></div>
<div class="admin-modal-body">
<div class="admin-preview" style="background-image:url('<?php echo h(hero_background()); ?>')"></div>

<form method="post" enctype="multipart/form-data" class="admin-form">
<input type="hidden" name="csrf" value="<?php echo h($csrf); ?>"/>
<input type="hidden" name="acao" value="hero_upload"/>
<label>Enviar nova imagem</label><input type="file" name="hero_image" accept="image/jpeg,image/png,image/gif"/>
<button class="admin-btn" type="submit">Enviar e aplicar</button>
</form>

<hr style="border:0;border-top:1px solid rgba(255,255,255,.07);margin:22px 0"/>

<form method="post" class="admin-form">
<input type="hidden" name="csrf" value="<?php echo h($csrf); ?>"/>
<input type="hidden" name="acao" value="hero_path"/>
<label>Caminho / URL</label><input type="text" name="hero_path" value="<?php echo h(hero_background()); ?>"/>
<button class="admin-btn" type="submit">Salvar caminho</button>
</form>

</div></div></div>

<!-- ======================================================
INDEX BG
====================================================== -->
<div class="admin-modal" id="modalIndexBg"><div class="admin-modal-box">
<div class="admin-modal-head"><h2>Background da Index + Fade</h2><button type="button" class="admin-modal-close" onclick="adminClose('modalIndexBg')">&times;</button></div>
<div class="admin-modal-body">
<form method="post" enctype="multipart/form-data" class="admin-form">
<input type="hidden" name="csrf" value="<?php echo h($csrf); ?>"/>
<input type="hidden" name="acao" value="index_save"/>
<div class="admin-form-grid">
<div><label>Modo</label><select name="mode"><option value="gradient" <?php echo $indexCfg['mode']=='gradient'?'selected="selected"':''; ?>>Gradiente</option><option value="image" <?php echo $indexCfg['mode']=='image'?'selected="selected"':''; ?>>Imagem + gradiente</option></select></div>
<div><label>Fade (0-100)</label><input type="range" name="fade" min="0" max="100" value="<?php echo intval($indexCfg['fade']); ?>"/></div>
<div><label>Cor 1</label><input type="color" name="color1" value="<?php echo h($indexCfg['color1']); ?>"/></div>
<div><label>Cor 2</label><input type="color" name="color2" value="<?php echo h($indexCfg['color2']); ?>"/></div>
<div><label>Enviar imagem</label><input type="file" name="index_image" accept="image/jpeg,image/png,image/gif"/></div>
<div><label>Caminho / URL</label><input name="index_image_path" value="<?php echo h($indexCfg['image']); ?>"/></div>
</div>
<button class="admin-btn" type="submit">Salvar aparência</button>
</form>
</div></div></div>

<!-- ======================================================
DOWNLOADS
====================================================== -->
<div class="admin-modal" id="modalDownloads"><div class="admin-modal-box wide">
<div class="admin-modal-head"><h2>Gerenciar downloads</h2><button type="button" class="admin-modal-close" onclick="adminClose('modalDownloads')">&times;</button></div>
<div class="admin-modal-body">

<form method="post" class="admin-form" id="downloadForm">
<input type="hidden" name="csrf" value="<?php echo h($csrf); ?>"/>
<input type="hidden" name="acao" value="download_save"/>
<input type="hidden" name="download_id" id="download_id"/>

<div class="admin-form-grid">
<div><label>Nome</label><input name="download_name" id="download_name"/></div>
<div><label>Tamanho</label><input name="download_size" id="download_size" placeholder="Ex.: 1.8 GB"/></div>
<div class="admin-full"><label>Descrição</label><textarea name="download_description" id="download_description"></textarea></div>
<div class="admin-full"><label>Link do botão</label><input name="download_link" id="download_link" placeholder="https://..."/></div>
</div>

<div class="admin-actions-row">
<button class="admin-btn" type="submit">Salvar download</button>
<button class="admin-btn gray" type="button" onclick="adminClearDownload()">Novo</button>
</div>
</form>

<div style="margin-top:22px">
<?php foreach($downloads as $i=>$d){ ?>
<div class="admin-download-row">
<strong><?php echo h($d['name']); ?></strong>
<small> · <?php echo h($d['size']); ?></small>
<p><?php echo h($d['description']); ?></p>
<div class="admin-actions-row">
<button type="button" class="admin-mini-btn" onclick="adminEditDownload(<?php echo intval($i); ?>)">Editar</button>
<form method="post" onsubmit="return confirm('Excluir este download?');">
<input type="hidden" name="csrf" value="<?php echo h($csrf); ?>"/>
<input type="hidden" name="acao" value="download_delete"/>
<input type="hidden" name="download_id" value="<?php echo h($d['id']); ?>"/>
<button type="submit" class="admin-mini-btn danger">Excluir</button>
</form>
</div>
</div>
<?php } ?>
</div>

</div></div></div>

<!-- ======================================================
SOCIAIS
====================================================== -->
<div class="admin-modal" id="modalSocial"><div class="admin-modal-box">
<div class="admin-modal-head"><h2>Redes sociais</h2><button type="button" class="admin-modal-close" onclick="adminClose('modalSocial')">&times;</button></div>
<div class="admin-modal-body">
<form method="post" class="admin-form">
<input type="hidden" name="csrf" value="<?php echo h($csrf); ?>"/>
<input type="hidden" name="acao" value="social_save"/>
<?php foreach($socials as $sk=>$sv){ ?>
<div style="border-bottom:1px solid rgba(255,255,255,.07);padding:10px 0 16px">
<label style="display:flex;align-items:center;gap:8px">
<input style="width:auto" type="checkbox" name="social_enabled_<?php echo h($sk); ?>" value="1" <?php echo intval($sv['enabled'])===1?'checked="checked"':''; ?>/>
<?php echo h(social_label($sk)); ?> ativo
</label>
<input type="text" name="social_url_<?php echo h($sk); ?>" value="<?php echo h($sv['url']); ?>"/>
</div>
<?php } ?>
<button class="admin-btn" type="submit">Salvar redes sociais</button>
</form>
</div></div></div>

<!-- ======================================================
DIAGNÓSTICO
====================================================== -->
<div class="admin-modal" id="modalDiagnostic"><div class="admin-modal-box">
<div class="admin-modal-head"><h2>Diagnóstico</h2><button type="button" class="admin-modal-close" onclick="adminClose('modalDiagnostic')">&times;</button></div>
<div class="admin-modal-body">
<div class="admin-table-wrap">
<table class="admin-table2">
<tr><th>PHP</th><td><?php echo h(PHP_VERSION); ?></td></tr>
<tr><th>Extensão MSSQL</th><td><?php echo function_exists('mssql_connect')?'OK':'OFF'; ?></td></tr>
<tr><th>Conexão SQL</th><td><?php echo db_ok()?'OK':'OFF'; ?></td></tr>
<tr><th>Hero atual</th><td><?php echo h(hero_background()); ?></td></tr>
<tr><th>Index</th><td><?php echo h($indexCfg['mode']); ?></td></tr>
<tr><th>Contas</th><td><?php echo intval($totalAccounts); ?></td></tr>
<tr><th>Personagens</th><td><?php echo intval($totalCharacters); ?></td></tr>
<tr><th>Online</th><td><?php echo intval($totalOnline); ?></td></tr>
</table>
</div>
</div></div></div>

<script type="text/javascript">
var adminCharacters = <?php
echo json_encode($characters);
?>;

var adminAccounts = <?php
echo json_encode($accounts);
?>;

var adminBalances = <?php
$balanceMap=array();
foreach($accounts as $a){
    $balanceMap[$a['memb___id']]=admin_balance_account($a['memb___id']);
}
echo json_encode($balanceMap);
?>;

var adminDownloads = <?php echo json_encode($downloads); ?>;

function adminOpen(id){
    var e=document.getElementById(id);
    if(e){
        e.className='admin-modal open';
        document.body.style.overflow='hidden';
    }
}

function adminClose(id){
    var e=document.getElementById(id);
    if(e){
        e.className='admin-modal';
        document.body.style.overflow='';
    }
}

function adminSet(id,value){
    var e=document.getElementById(id);
    if(e){
        e.value=(value===null || typeof value==='undefined')?'':value;
    }
}

function adminLoadCharacter(index){
    if(index==='') return;
    var c=adminCharacters[parseInt(index,10)];
    if(!c) return;

    adminSet('char_account',c.AccountID);
    adminSet('char_name',c.Name);
    adminSet('char_class',c.Class);
    adminSet('char_level',c.cLevel);
    adminSet('char_points',c.LevelUpPoint);
    adminSet('char_resets',c.ResetCount);
    adminSet('char_mresets',c.MasterResetCount);
    adminSet('char_money',c.Money);
    adminSet('char_strength',c.Strength);
    adminSet('char_dexterity',c.Dexterity);
    adminSet('char_vitality',c.Vitality);
    adminSet('char_energy',c.Energy);
    adminSet('char_leadership',c.Leadership);
    adminSet('char_ctlcode',c.CtlCode);
}

function adminLoadAccount(index){
    if(index==='') return;
    var a=adminAccounts[parseInt(index,10)];
    if(!a) return;

    adminSet('edit_account',a.memb___id);
    adminSet('edit_name',a.memb_name);
    adminSet('edit_email',a.mail_addr);
    adminSet('edit_vip',a.AccountLevel);
    adminSet('edit_expire',a.AccountExpireDate);
}

function adminLoadMove(index){
    if(index==='') return;
    var c=adminCharacters[parseInt(index,10)];
    if(!c) return;

    adminSet('move_account',c.AccountID);
    adminSet('move_name',c.Name);
    adminSet('move_map',c.MapNumber);
    adminSet('move_x',c.MapPosX);
    adminSet('move_y',c.MapPosY);
}

function adminLoadBalance(index){
    if(index==='') return;
    var a=adminAccounts[parseInt(index,10)];
    if(!a) return;

    var b=adminBalances[a.memb___id];

    adminSet('balance_account',a.memb___id);
    adminSet('balance_wcoinc',b?b.WCoinC:0);
    adminSet('balance_wcoinp',b?b.WCoinP:0);
    adminSet('balance_goblin',b?b.GoblinPoint:0);
}

function adminEditDownload(index){
    var d=adminDownloads[index];
    if(!d) return;

    adminSet('download_id',d.id);
    adminSet('download_name',d.name);
    adminSet('download_size',d.size);
    adminSet('download_description',d.description);
    adminSet('download_link',d.link);
}

function adminClearDownload(){
    adminSet('download_id','');
    adminSet('download_name','');
    adminSet('download_size','');
    adminSet('download_description','');
    adminSet('download_link','');
}

document.onkeydown=function(ev){
    ev=ev||window.event;

    if(ev.keyCode==27){

        var divs=document.getElementsByTagName('div');

        for(var i=0;i<divs.length;i++){
            if(divs[i].className=='admin-modal open'){
                divs[i].className='admin-modal';
            }
        }

        document.body.style.overflow='';
    }
};
</script>

<?php include('includes/footer.php'); ?>
