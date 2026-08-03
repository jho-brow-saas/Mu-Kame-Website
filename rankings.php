<?php
require_once('config.php'); $pageTitle=t('rankings'); $tipo=isset($_GET['tipo'])?$_GET['tipo']:'resets'; $rows=array();
if(db_ok()){
 if($tipo=='kills')$q=@mssql_query("SELECT TOP 50 Name,Class,cLevel,ResetCount,MasterResetCount,Kills,Deads FROM Character WHERE (CtlCode=0 OR CtlCode IS NULL) ORDER BY Kills DESC,Deads ASC");
 elseif($tipo=='level')$q=@mssql_query("SELECT TOP 50 Name,Class,cLevel,ResetCount,MasterResetCount,Kills,Deads FROM Character WHERE (CtlCode=0 OR CtlCode IS NULL) ORDER BY cLevel DESC,Experience DESC");
 elseif($tipo=='master')$q=@mssql_query("SELECT TOP 50 Name,Class,cLevel,ResetCount,MasterResetCount,Kills,Deads FROM Character WHERE (CtlCode=0 OR CtlCode IS NULL) ORDER BY MasterResetCount DESC,ResetCount DESC");
 else $q=@mssql_query("SELECT TOP 50 Name,Class,cLevel,ResetCount,MasterResetCount,Kills,Deads FROM Character WHERE (CtlCode=0 OR CtlCode IS NULL) ORDER BY ResetCount DESC,cLevel DESC");
 if($q)while($r=@mssql_fetch_assoc($q))$rows[]=$r;
}
include('includes/header.php');
?>
<div class="page-head"><span class="eyebrow"><?php echo h(t('competitive')); ?></span><h1><?php echo h(t('server_rankings')); ?></h1><div class="tabs"><a href="?tipo=resets" class="<?php echo $tipo=='resets'?'active':''; ?>"><?php echo h(t('resets')); ?></a><a href="?tipo=master" class="<?php echo $tipo=='master'?'active':''; ?>"><?php echo h(t('master_reset')); ?></a><a href="?tipo=level" class="<?php echo $tipo=='level'?'active':''; ?>"><?php echo h(t('level')); ?></a><a href="?tipo=kills" class="<?php echo $tipo=='kills'?'active':''; ?>">Killers</a></div></div>
<div class="panel table-panel"><table><thead><tr><th>#</th><th><?php echo h(t('player')); ?></th><th><?php echo h(t('class')); ?></th><th><?php echo h(t('level')); ?></th><th><?php echo h(t('resets')); ?></th><th>M. Reset</th><th><?php echo h(t('kills')); ?></th><th><?php echo h(t('deads')); ?></th></tr></thead><tbody><?php if(!count($rows)){ ?><tr><td colspan="8"><?php echo h(t('no_data')); ?></td></tr><?php } ?><?php foreach($rows as $i=>$r){ ?><tr><td><b>#<?php echo $i+1; ?></b></td><td><?php echo h($r['Name']); ?></td><td><?php echo h(classe_nome($r['Class'])); ?></td><td><?php echo format_num($r['cLevel']); ?></td><td><?php echo format_num($r['ResetCount']); ?></td><td><?php echo format_num($r['MasterResetCount']); ?></td><td><?php echo format_num($r['Kills']); ?></td><td><?php echo format_num($r['Deads']); ?></td></tr><?php } ?></tbody></table></div>
<?php include('includes/footer.php'); ?>
