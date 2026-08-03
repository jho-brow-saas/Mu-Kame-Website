<?php require_once('config.php'); $pageTitle=t('support'); $socials=get_socials(); include('includes/header.php'); ?>
<div class="page-head"><span class="eyebrow"><?php echo h(t('help_center')); ?></span><h1><?php echo h(t('support')); ?></h1></div>
<div class="cards-grid"><div class="panel support-card"><h2>WhatsApp</h2><p><?php echo h(t('fast_help')); ?></p><a class="primary-btn" href="<?php echo h($socials['whatsapp']['url']); ?>" target="_blank"><?php echo h(t('open_whatsapp')); ?></a></div><div class="panel support-card"><h2>Discord</h2><p><?php echo h(t('community_help')); ?></p><a class="primary-btn" href="<?php echo h($socials['discord']['url']); ?>" target="_blank"><?php echo h(t('join_discord')); ?></a></div></div>
<?php include('includes/footer.php'); ?>
