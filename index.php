<?php
require_once('config.php');
$pageTitle=t('dashboard'); $top=top_players(5); $killers=top_killers(5); $u=usuario_logado();
$account=$u?get_account_data($u['id']):array('AccountLevel'=>0); $cash=$u?get_cash_data($u['id']):array('WCoinC'=>0);
include('includes/header.php');
?>
<section class="hero-grid">
<div class="panel hero-card" style="<?php echo hero_background_style(); ?>">
    <div class="eyebrow"><?php echo h(t('top_agent')); ?></div>
    <h1><?php echo count($top)?h($top[0]['Name']):'MU HERO'; ?></h1>
    <p><?php echo h(t('hero_desc')); ?></p>
    <div class="hero-stats">
      <div><strong><?php echo count($top)?format_num($top[0]['ResetCount']):'0'; ?></strong><span><?php echo h(t('resets')); ?></span></div>
      <div><strong><?php echo count($top)?format_num($top[0]['cLevel']):'0'; ?></strong><span><?php echo h(t('level')); ?></span></div>
      <div><strong><?php echo count($top)?h(classe_nome($top[0]['Class'])):'--'; ?></strong><span><?php echo h(t('class')); ?></span></div>
    </div>
</div>
<div class="panel account-card">
    <div class="eyebrow"><?php echo h(t('your_account')); ?></div>
    <?php if($u){ ?>
      <h2><?php echo h($u['id']); ?></h2>
      <div class="progress"><i style="width:<?php echo min(100,intval($cash['WCoinC'])/10); ?>%"></i></div>
      <div class="account-row"><span><?php echo h(t('plan')); ?></span><b><?php echo h(vip_nome($account['AccountLevel'])); ?></b></div>
      <div class="account-row"><span>WCoinC</span><b><?php echo format_num($cash['WCoinC']); ?></b></div>
      <a class="primary-btn" href="personagens.php"><?php echo h(t('open_account')); ?></a>
    <?php }else{ ?>
      <h2><?php echo h(t('connect')); ?></h2><p><?php echo h(t('connect_desc')); ?></p><button class="primary-btn js-open-login" type="button"><?php echo h(t('login_now')); ?></button>
    <?php } ?>
</div>
</section>
<section class="three-grid section-gap">
<div class="panel">
  <div class="section-head"><div><span class="eyebrow"><?php echo h(t('agents')); ?></span><h2><?php echo h(t('top_characters')); ?></h2></div><a href="rankings.php"><?php echo h(t('view_all')); ?></a></div>
  <div class="agent-grid">
  <?php if(!count($top)){ ?><div class="empty"><?php echo h(t('no_data')); ?></div><?php } ?>
  <?php foreach($top as $i=>$p){ ?><div class="agent-card"><div class="agent-rank">#<?php echo $i+1; ?></div><div><b><?php echo h($p['Name']); ?></b><small><?php echo h(classe_nome($p['Class'])); ?></small></div><strong><?php echo format_num($p['ResetCount']); ?> R</strong></div><?php } ?>
  </div>
</div>
<div class="panel compact-panel"><span class="eyebrow"><?php echo h(t('top_killers')); ?></span><h2>PvP</h2><?php foreach($killers as $i=>$p){ ?><div class="mini-row"><span>#<?php echo ($i+1).' '.h($p['Name']); ?></span><b><?php echo format_num($p['Kills']); ?></b></div><?php } ?></div>
<div class="panel compact-panel"><span class="eyebrow"><?php echo h(t('status')); ?></span><h2><?php echo h(t('server')); ?></h2><div class="status-big"><i></i><span>ONLINE</span></div><div class="mini-row"><span><?php echo h(t('connected_players')); ?></span><b><?php echo total_online(); ?></b></div><div class="mini-row"><span><?php echo h(t('database')); ?></span><b><?php echo db_ok()?'OK':'OFF'; ?></b></div></div>
</section>
<?php include('includes/footer.php'); ?>
