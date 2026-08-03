</div>
<?php $socials=get_socials(); ?>
<footer class="footer">
  <div>© <?php echo date('Y'); ?> <?php echo h(SITE_NAME); ?> · <?php echo h(t('footer_text')); ?></div>
  <div class="social-links">
    <?php foreach($socials as $sk=>$sv){ if(intval($sv['enabled'])!==1 || trim($sv['url'])=='')continue; ?>
      <a href="<?php echo h($sv['url']); ?>" target="_blank" rel="noopener" title="<?php echo h(social_label($sk)); ?>"><span><?php echo h(social_icon($sk)); ?></span><em><?php echo h(social_label($sk)); ?></em></a>
    <?php } ?>
  </div>
</footer>
</main>
</div>
<?php include(dirname(__FILE__).'/auth_modals.php'); ?>
<?php if(isset($open_auth_modal)&&$open_auth_modal!=''){ ?><script>window.__openAuthModal=<?php echo json_encode($open_auth_modal); ?>;</script><?php } ?>
<script src="assets/js/app.js?v=20260725"></script>
</body>
</html>
