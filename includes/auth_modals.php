<?php $auth_error_text=isset($auth_error)?$auth_error:''; $register_message_text=isset($register_message)?$register_message:''; ?>
<div class="modal-backdrop" id="loginModal" aria-hidden="true">
  <div class="auth-modal panel" role="dialog" aria-modal="true">
    <button class="modal-x js-close-modal" type="button" aria-label="<?php echo h(t('modal_close')); ?>">×</button>
    <span class="eyebrow"><?php echo h(t('secure_access')); ?></span><h2><?php echo h(t('login_panel')); ?></h2>
    <?php if($auth_error_text!='' && isset($open_auth_modal) && $open_auth_modal=='login'){ ?><div class="alert bad"><?php echo h($auth_error_text); ?></div><?php } ?>
    <?php if($register_message_text!=''){ ?><div class="alert ok"><?php echo h($register_message_text); ?></div><?php } ?>
    <form method="post" action="login.php" class="modal-form">
      <input type="hidden" name="csrf" value="<?php echo h(csrf_token()); ?>" />
      <label><?php echo h(t('account')); ?></label><input name="id" maxlength="10" autocomplete="username" required="required" />
      <label><?php echo h(t('password')); ?></label><input type="password" name="pw" maxlength="10" autocomplete="current-password" required="required" />
      <button class="primary-btn" type="submit"><?php echo h(t('login')); ?></button>
    </form>
    <p class="muted auth-switch"><?php echo h(t('no_account')); ?> <button type="button" class="link-btn js-switch-register"><?php echo h(t('create_account')); ?></button></p>
  </div>
</div>
<div class="modal-backdrop" id="registerModal" aria-hidden="true">
  <div class="auth-modal panel" role="dialog" aria-modal="true">
    <button class="modal-x js-close-modal" type="button" aria-label="<?php echo h(t('modal_close')); ?>">×</button>
    <span class="eyebrow"><?php echo h(t('new_account')); ?></span><h2><?php echo h(t('join_server')); ?></h2>
    <?php if($auth_error_text!='' && isset($open_auth_modal) && $open_auth_modal=='register'){ ?><div class="alert bad"><?php echo h($auth_error_text); ?></div><?php } ?>
    <form method="post" action="cadastro.php" class="modal-form">
      <input type="hidden" name="csrf" value="<?php echo h(csrf_token()); ?>" />
      <label><?php echo h(t('account')); ?></label><input name="id" maxlength="10" required="required" />
      <label><?php echo h(t('password')); ?></label><input type="password" name="pw" maxlength="10" required="required" />
      <label><?php echo h(t('name')); ?></label><input name="name" maxlength="10" required="required" />
      <label><?php echo h(t('email')); ?></label><input type="text" name="mail" maxlength="50" required="required" />
      <button class="primary-btn" type="submit"><?php echo h(t('create')); ?></button>
    </form>
    <p class="muted auth-switch"><button type="button" class="link-btn js-switch-login"><?php echo h(t('login')); ?></button></p>
  </div>
</div>
