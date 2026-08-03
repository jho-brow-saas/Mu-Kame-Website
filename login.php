<?php
require_once('config.php'); if(usuario_logado()){header('Location:index.php');exit;} $auth_error=''; $open_auth_modal='login';
if($_SERVER['REQUEST_METHOD']=='POST'){
 if(!validar_csrf())$auth_error=t('fill_fields'); else{
  $id=isset($_POST['id'])?trim($_POST['id']):''; $pw=isset($_POST['pw'])?trim($_POST['pw']):'';
  if($id==''||$pw=='')$auth_error=t('fill_fields'); elseif(!db_ok())$auth_error=t('db_unavailable'); else{
   $sid=sql_escape($id);$spw=sql_escape($pw);$q=@mssql_query("SELECT TOP 1 memb___id,memb__pwd,level FROM MEMB_INFO WHERE memb___id='".$sid."' AND memb__pwd='".$spw."'");
   if($q&&($r=@mssql_fetch_assoc($q))){$_SESSION['mu_user']=array('id'=>$r['memb___id'],'admin'=>(intval($r['level'])===1?1:0));header('Location:index.php');exit;}else$auth_error=t('invalid_login');
  }
 }
}
$pageTitle=t('login'); include('includes/header.php');
?>
<div class="page-head"><span class="eyebrow"><?php echo h(t('secure_access')); ?></span><h1><?php echo h(t('login_panel')); ?></h1><p><?php echo h(t('connect_desc')); ?></p></div>
<script>window.__openAuthModal='login';</script>
<?php include('includes/footer.php'); ?>
