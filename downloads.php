<?php require_once('config.php'); $pageTitle=t('downloads_title'); $items=get_downloads(); include('includes/header.php'); ?>
<div class="page-head"><span class="eyebrow"><?php echo h(t('client')); ?></span><h1><?php echo h(t('downloads_title')); ?></h1><p><?php echo h(t('downloads_desc')); ?></p></div>
<div class="download-list">
<?php if(!count($items)){ ?><div class="panel empty"><?php echo h(t('no_downloads')); ?></div><?php } ?>
<?php foreach($items as $d){ ?>
  <div class="panel download-card"><div class="download-icon">⬇</div><div><h2><?php echo h($d['name']); ?></h2><p><?php echo h($d['description']); ?></p><small class="download-meta"><?php echo h(t('size')); ?>: <?php echo h($d['size']); ?></small></div><a class="primary-btn" href="<?php echo h($d['link']); ?>" target="_blank" rel="noopener"><?php echo h(t('download')); ?></a></div>
<?php } ?>
</div>
<?php include('includes/footer.php'); ?>
