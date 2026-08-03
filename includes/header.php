<?php

if(!isset($pageTitle)){
    $pageTitle = SITE_NAME;
}

$u    = usuario_logado();
$lang = current_lang();


/*
=========================================================
AVATAR DA CONTA
=========================================================

Formato esperado em:

dados/avatars.txt

Exemplo:

allan|uploads/avatars/avatar_allan.jpg
admin|uploads/avatars/avatar_admin.png

Compatível com PHP 5.2.1
=========================================================
*/

function header_avatar_conta($account)
{
    $arquivo = dirname(dirname(__FILE__)).'/dados/avatars.txt';

    if(!file_exists($arquivo)){
        return '';
    }

    $linhas = @file(
        $arquivo,
        FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES
    );

    if(!$linhas){
        return '';
    }

    foreach($linhas as $linha)
    {
        $linha = trim($linha);

        if($linha == ''){
            continue;
        }

        if(substr($linha,0,1) == '#'){
            continue;
        }

        $p = strpos($linha,'|');

        if($p === false){
            continue;
        }

        $conta = trim(
            substr(
                $linha,
                0,
                $p
            )
        );

        $avatar = trim(
            substr(
                $linha,
                $p + 1
            )
        );

        if(
            strtolower($conta)
            ==
            strtolower($account)
        ){
            return $avatar;
        }
    }

    return '';
}


/*
=========================================================
CARREGAR AVATAR DO USUÁRIO LOGADO
=========================================================
*/

$avatarConta = '';

if($u){
    $avatarConta = header_avatar_conta($u['id']);
}

?>
<!DOCTYPE html>

<html lang="<?php echo h($lang); ?>">

<head>

<meta charset="utf-8" />

<meta
http-equiv="X-UA-Compatible"
content="IE=edge"
/>

<meta
name="viewport"
content="width=device-width, initial-scale=1"
/>

<title>
<?php echo page_title($pageTitle); ?>
</title>

<link
rel="stylesheet"
href="assets/css/style.css?v=20260725"
/>

<style type="text/css">

/*
=========================================================
AVATAR SIDEBAR
=========================================================
*/

.avatar-mini
{
    width:44px;
    height:44px;

    min-width:44px;

    border-radius:14px;

    display:flex;

    align-items:center;
    justify-content:center;

    overflow:hidden;

    background:
        linear-gradient(
            135deg,
            #714dff,
            #13d7ff
        );

    color:#ffffff;

    font-size:18px;
    font-weight:800;

    border:
        1px solid
        rgba(
            255,
            255,
            255,
            .10
        );

    box-shadow:
        0 8px 25px
        rgba(
            72,
            86,
            255,
            .25
        );
}


.avatar-mini img
{
    width:100%;
    height:100%;

    display:block;

    object-fit:cover;

    object-position:center;
}


/*
=========================================================
AVATAR TOPO OPCIONAL
=========================================================
*/

.top-user-avatar
{
    width:36px;
    height:36px;

    border-radius:12px;

    overflow:hidden;

    display:flex;

    align-items:center;
    justify-content:center;

    color:#ffffff;

    font-size:14px;
    font-weight:bold;

    background:
        linear-gradient(
            135deg,
            #6b4cff,
            #17d3ed
        );

    border:
        1px solid
        rgba(
            255,
            255,
            255,
            .1
        );
}


.top-user-avatar img
{
    width:100%;
    height:100%;

    object-fit:cover;
    object-position:center;

    display:block;
}

</style>

</head>


<body

class="<?php

echo
basename($_SERVER['PHP_SELF']) == 'index.php'
?
'home-page'
:
'inner-page';

?>"

style="<?php

echo

basename($_SERVER['PHP_SELF']) == 'index.php'

?

index_background_style()

:

'background-image:
linear-gradient(
135deg,
#090816,
#17102b
);
background-attachment:fixed;';

?>"

>


<div class="app-shell">


<!-- =====================================================
SIDEBAR
===================================================== -->

<aside class="sidebar">


<div class="brand">

<span class="brand-mark">
M
</span>

<strong>
<?php echo h(SITE_NAME); ?>
</strong>

</div>


<nav>


<a
class="<?php echo nav_active('index.php'); ?>"
href="index.php"
>

<span>
◈
</span>

<?php echo h(t('dashboard')); ?>

</a>



<a
class="<?php echo nav_active('rankings.php'); ?>"
href="rankings.php"
>

<span>
✦
</span>

<?php echo h(t('rankings')); ?>

</a>



<a
class="<?php echo nav_active('personagens.php'); ?>"
href="personagens.php"
>

<span>
♟
</span>

<?php echo h(t('characters')); ?>

</a>



<a
class="<?php echo nav_active('downloads.php'); ?>"
href="downloads.php"
>

<span>
⬇
</span>

<?php echo h(t('downloads')); ?>

</a>



<a
class="<?php echo nav_active('vip.php'); ?>"
href="vip.php"
>

<span>
◆
</span>

<?php echo h(t('vipcoins')); ?>

</a>



<a
class="<?php echo nav_active('suporte.php'); ?>"
href="suporte.php"
>

<span>
?
</span>

<?php echo h(t('support')); ?>

</a>



<?php

if(eh_admin()){

?>

<a
class="<?php echo nav_active('admin.php'); ?>"
href="admin.php"
>

<span>
⚙
</span>

<?php echo h(t('admin')); ?>

</a>

<?php

}

?>


</nav>



<!-- =====================================================
USUÁRIO SIDEBAR
===================================================== -->

<div class="side-user">


<?php

if($u){

?>


<div class="avatar-mini">


<?php

if($avatarConta != ''){

?>


<img
src="<?php echo h($avatarConta); ?>"
alt="<?php echo h($u['id']); ?>"
/>


<?php

}else{

?>


<?php

echo strtoupper(
    substr(
        $u['id'],
        0,
        1
    )
);

?>


<?php

}

?>


</div>



<div>


<b>

<?php echo h($u['id']); ?>

</b>


<small>

<?php

echo h(
    eh_admin()
    ?
    t('administrator')
    :
    t('player')
);

?>

</small>


</div>


<?php

}else{

?>


<div>


<b>

<?php echo h(t('visitor')); ?>

</b>


<small>

<?php echo h(t('login_hint')); ?>

</small>


</div>


<?php

}

?>


</div>


</aside>



<!-- =====================================================
CONTEÚDO
===================================================== -->

<main class="main">



<!-- =====================================================
TOPBAR
===================================================== -->

<header class="topbar">



<div class="searchbox">

⌕

<input
type="text"
id="fakeSearch"
placeholder="<?php echo h(t('search')); ?>"
/>

</div>



<div class="top-actions">


<span class="online-dot">
</span>


<small>

<?php

echo
total_online()
.
' '
.
h(t('online'));

?>

</small>



<!-- =====================================================
IDIOMAS
===================================================== -->

<select
class="lang-select"
onchange="if(this.value)window.location=this.value"
aria-label="<?php echo h(t('language')); ?>"
>


<?php


$idiomas = array(
    'pt',
    'es',
    'vi',
    'zh',
    'en'
);


foreach($idiomas as $lc){

?>


<option

value="<?php echo h(lang_url($lc)); ?>"

<?php

echo
$lang == $lc
?
'selected="selected"'
:
'';

?>

>

<?php echo h(lang_name($lc)); ?>

</option>


<?php

}

?>


</select>



<!-- =====================================================
USUÁRIO LOGADO
===================================================== -->

<?php

if($u){

?>


<div class="top-user-avatar">


<?php

if($avatarConta != ''){

?>


<img
src="<?php echo h($avatarConta); ?>"
alt="<?php echo h($u['id']); ?>"
/>


<?php

}else{

?>


<?php

echo strtoupper(
    substr(
        $u['id'],
        0,
        1
    )
);

?>


<?php

}

?>


</div>



<a
class="ghost-btn"
href="logout.php"
>

<?php echo h(t('logout')); ?>

</a>


<?php

}else{

?>


<button
class="ghost-btn js-open-login"
type="button"
>

<?php echo h(t('login')); ?>

</button>


<?php

}

?>


</div>


</header>



<!-- =====================================================
ÁREA INTERNA DA PÁGINA
===================================================== -->

<div class="content">