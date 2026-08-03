<?php
function h($v) { return htmlspecialchars($v, ENT_QUOTES, 'UTF-8'); }
function data_file($name) { return DATA_DIR . '/' . $name; }

function read_text_file($name, $default) {
    $file = data_file($name);
    if (!file_exists($file)) return $default;
    $v = trim(@file_get_contents($file));
    return ($v === '') ? $default : $v;
}
function write_text_file($name, $value) {
    return @file_put_contents(data_file($name), $value, LOCK_EX) !== false;
}
function read_kv_file($name, $defaults) {
    $out = $defaults;
    $file = data_file($name);
    if (!file_exists($file)) return $out;
    $lines = @file($file, FILE_IGNORE_NEW_LINES);
    if (!$lines) return $out;
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line == '' || substr($line,0,1) == '#') continue;
        $p = strpos($line, '=');
        if ($p === false) continue;
        $k = trim(substr($line,0,$p));
        $v = trim(substr($line,$p+1));
        if ($k != '') $out[$k] = $v;
    }
    return $out;
}
function write_kv_file($name, $arr) {
    $rows = array();
    foreach ($arr as $k=>$v) $rows[] = $k.'='.$v;
    return @file_put_contents(data_file($name), implode("\n",$rows)."\n", LOCK_EX) !== false;
}

function db_ok() { global $db_link; return $db_link ? true : false; }
function sql_escape($v) { return str_replace("'", "''", trim($v)); }

function usuario_logado() {
    if (isset($_SESSION['mu_user']) && is_array($_SESSION['mu_user'])) return $_SESSION['mu_user'];
    return false;
}
function exigir_login() { if (!usuario_logado()) { header('Location: login.php'); exit; } }
function eh_admin() { $u=usuario_logado(); return $u && isset($u['admin']) && intval($u['admin'])===1; }
function exigir_admin() { exigir_login(); if (!eh_admin()) { header('Location:index.php'); exit; } }
function csrf_token() { if (!isset($_SESSION['csrf'])) $_SESSION['csrf']=md5(uniqid(rand(),true)); return $_SESSION['csrf']; }
function validar_csrf() { return isset($_POST['csrf'],$_SESSION['csrf']) && $_POST['csrf']===$_SESSION['csrf']; }

function current_lang() {
    $allowed=array('pt','es','vi','zh','en');
    if (isset($_GET['lang']) && in_array($_GET['lang'],$allowed)) {
        $_SESSION['site_lang']=$_GET['lang'];
        @setcookie('site_lang',$_GET['lang'],time()+31536000,'/');
    } elseif (!isset($_SESSION['site_lang']) && isset($_COOKIE['site_lang']) && in_array($_COOKIE['site_lang'],$allowed)) {
        $_SESSION['site_lang']=$_COOKIE['site_lang'];
    }
    return isset($_SESSION['site_lang']) && in_array($_SESSION['site_lang'],$allowed) ? $_SESSION['site_lang'] : 'pt';
}
function lang_name($code) {
    $m=array('pt'=>'Português','es'=>'Español','vi'=>'Tiếng Việt','zh'=>'中文','en'=>'English');
    return isset($m[$code])?$m[$code]:$code;
}
function t($key) {
    static $tr=null;
    if ($tr===null) {
        $tr=array(
        'pt'=>array(
            'dashboard'=>'Dashboard','rankings'=>'Rankings','characters'=>'Personagens','downloads'=>'Downloads','vipcoins'=>'VIP & Coins','support'=>'Suporte','admin'=>'Administração','login'=>'Entrar','logout'=>'Sair','visitor'=>'Visitante','login_hint'=>'Faça seu login','administrator'=>'Administrador','player'=>'Jogador','search'=>'Buscar jogador, ranking ou recurso...','online'=>'online','footer_text'=>'Dashboard MU Online','language'=>'Idioma',
            'top_agent'=>'TOP AGENT','hero_desc'=>'O painel central do seu servidor. Ranking, conta, personagem, VIP e moedas em uma interface premium.','resets'=>'Resets','level'=>'Level','class'=>'Classe','your_account'=>'SUA CONTA','plan'=>'Plano','open_account'=>'Abrir minha conta','connect'=>'Conecte-se','connect_desc'=>'Acesse sua conta para ver personagens e saldo.','login_now'=>'Entrar agora','agents'=>'AGENTS','top_characters'=>'Top personagens','view_all'=>'Ver todos','top_killers'=>'TOP KILLERS','server'=>'Servidor','connected_players'=>'Jogadores conectados','database'=>'Database','status'=>'STATUS',
            'competitive'=>'COMPETITIVO','server_rankings'=>'Rankings do servidor','master_reset'=>'Master Reset','kills'=>'Kills','deads'=>'Deads','no_data'=>'Sem dados para exibir.','my_account'=>'MINHA CONTA','characters_count'=>'Personagens','no_characters'=>'Nenhum personagem encontrado.','upgrade'=>'UPGRADE','vip_plans'=>'Planos VIP','vip_desc'=>'Conheça os planos e benefícios disponíveis.','basic_access'=>'Acesso básico ao servidor.','more_advantages'=>'Mais vantagens para evolução.','premium_experience'=>'Experiência premium completa.','buy'=>'Comprar','help_center'=>'CENTRAL DE AJUDA','fast_help'=>'Atendimento rápido para dúvidas e problemas de acesso.','open_whatsapp'=>'Abrir WhatsApp','community_help'=>'Comunidade, novidades, eventos e suporte.','join_discord'=>'Entrar no Discord',
            'client'=>'CLIENTE','downloads_title'=>'Downloads','downloads_desc'=>'Arquivos essenciais para começar a jogar.','download'=>'Baixar','size'=>'Tamanho','no_downloads'=>'Nenhum download cadastrado.','secure_access'=>'ACESSO SEGURO','login_panel'=>'Entrar no painel','account'=>'Conta','password'=>'Senha','no_account'=>'Ainda não tem conta?','create_account'=>'Criar cadastro','new_account'=>'NOVA CONTA','join_server'=>'Junte-se ao servidor','name'=>'Nome','email'=>'E-mail','create'=>'Criar conta','fill_fields'=>'Preencha todos os campos.','invalid_login'=>'Login ou senha inválidos.','db_unavailable'=>'Banco de dados indisponível.','account_exists'=>'Esta conta já existe.','account_created'=>'Conta criada com sucesso. Você já pode entrar.','modal_close'=>'Fechar','register'=>'Cadastro',
            'admin_panel'=>'PAINEL ADMIN','portal_control'=>'Central de administração','portal_control_desc'=>'Gerencie aparência, downloads e redes sociais sem editar código.','appearance'=>'Aparência','hero_background'=>'Background do painel Hero','hero_help'=>'Imagem do bloco principal da index (panel hero-card).','upload_apply'=>'Enviar e aplicar','use_path'=>'Usar caminho/URL','save'=>'Salvar','index_background'=>'Fundo geral da index','background_mode'=>'Modo de fundo','gradient'=>'Gradiente','image_gradient'=>'Imagem + fade','color_1'=>'Cor inicial','color_2'=>'Cor final','background_image'=>'Imagem de fundo','fade_strength'=>'Intensidade do fade','downloads_manage'=>'Gerenciar downloads','add_download'=>'Adicionar download','edit_download'=>'Editar download','description'=>'Descrição','button_link'=>'Link do botão','actions'=>'Ações','edit'=>'Editar','delete'=>'Excluir','cancel'=>'Cancelar','social_manage'=>'Redes sociais','social_desc'=>'Ative/desative os ícones e altere seus links.','enabled'=>'Ativo','link'=>'Link','diagnostic'=>'Diagnóstico','php_version'=>'PHP','mssql_ext'=>'Extensão MSSQL','sql_connection'=>'Conexão SQL','current_hero'=>'Hero atual','current_index'=>'Fundo index','success_saved'=>'Alterações salvas com sucesso.','confirm_delete'=>'Excluir este item?','choose_image'=>'Selecione uma imagem.','invalid_image'=>'Formato inválido. Use JPG, PNG ou GIF.','upload_fail'=>'Não foi possível salvar o arquivo. Verifique permissões.','file_too_big'=>'A imagem deve ter no máximo 5 MB.','title'=>'Título'
        ),
        'es'=>array(
            'dashboard'=>'Panel','rankings'=>'Rankings','characters'=>'Personajes','downloads'=>'Descargas','vipcoins'=>'VIP & Monedas','support'=>'Soporte','admin'=>'Administración','login'=>'Entrar','logout'=>'Salir','visitor'=>'Visitante','login_hint'=>'Inicia sesión','administrator'=>'Administrador','player'=>'Jugador','search'=>'Buscar jugador, ranking o recurso...','online'=>'en línea','footer_text'=>'Panel MU Online','language'=>'Idioma',
            'top_agent'=>'MEJOR AGENTE','hero_desc'=>'El panel central de tu servidor. Ranking, cuenta, personaje, VIP y monedas en una interfaz premium.','resets'=>'Resets','level'=>'Nivel','class'=>'Clase','your_account'=>'TU CUENTA','plan'=>'Plan','open_account'=>'Abrir mi cuenta','connect'=>'Conéctate','connect_desc'=>'Accede a tu cuenta para ver personajes y saldo.','login_now'=>'Entrar ahora','agents'=>'AGENTES','top_characters'=>'Mejores personajes','view_all'=>'Ver todos','top_killers'=>'MEJORES KILLERS','server'=>'Servidor','connected_players'=>'Jugadores conectados','database'=>'Base de datos','status'=>'ESTADO',
            'competitive'=>'COMPETITIVO','server_rankings'=>'Rankings del servidor','master_reset'=>'Master Reset','kills'=>'Kills','deads'=>'Muertes','no_data'=>'No hay datos para mostrar.','my_account'=>'MI CUENTA','characters_count'=>'Personajes','no_characters'=>'No se encontraron personajes.','upgrade'=>'MEJORA','vip_plans'=>'Planes VIP','vip_desc'=>'Conoce los planes y beneficios disponibles.','basic_access'=>'Acceso básico al servidor.','more_advantages'=>'Más ventajas para progresar.','premium_experience'=>'Experiencia premium completa.','buy'=>'Comprar','help_center'=>'CENTRO DE AYUDA','fast_help'=>'Atención rápida para dudas y problemas de acceso.','open_whatsapp'=>'Abrir WhatsApp','community_help'=>'Comunidad, novedades, eventos y soporte.','join_discord'=>'Entrar a Discord',
            'client'=>'CLIENTE','downloads_title'=>'Descargas','downloads_desc'=>'Archivos esenciales para empezar a jugar.','download'=>'Descargar','size'=>'Tamaño','no_downloads'=>'No hay descargas registradas.','secure_access'=>'ACCESO SEGURO','login_panel'=>'Entrar al panel','account'=>'Cuenta','password'=>'Contraseña','no_account'=>'¿Aún no tienes cuenta?','create_account'=>'Crear cuenta','new_account'=>'NUEVA CUENTA','join_server'=>'Únete al servidor','name'=>'Nombre','email'=>'Correo','create'=>'Crear cuenta','fill_fields'=>'Completa todos los campos.','invalid_login'=>'Usuario o contraseña inválidos.','db_unavailable'=>'Base de datos no disponible.','account_exists'=>'Esta cuenta ya existe.','account_created'=>'Cuenta creada con éxito. Ya puedes iniciar sesión.','modal_close'=>'Cerrar','register'=>'Registro',
            'admin_panel'=>'PANEL ADMIN','portal_control'=>'Centro de administración','portal_control_desc'=>'Gestiona apariencia, descargas y redes sociales sin editar código.','appearance'=>'Apariencia','hero_background'=>'Fondo del panel Hero','hero_help'=>'Imagen del bloque principal de la index (panel hero-card).','upload_apply'=>'Subir y aplicar','use_path'=>'Usar ruta/URL','save'=>'Guardar','index_background'=>'Fondo general de la index','background_mode'=>'Modo de fondo','gradient'=>'Gradiente','image_gradient'=>'Imagen + fade','color_1'=>'Color inicial','color_2'=>'Color final','background_image'=>'Imagen de fondo','fade_strength'=>'Intensidad del fade','downloads_manage'=>'Gestionar descargas','add_download'=>'Agregar descarga','edit_download'=>'Editar descarga','description'=>'Descripción','button_link'=>'Enlace del botón','actions'=>'Acciones','edit'=>'Editar','delete'=>'Eliminar','cancel'=>'Cancelar','social_manage'=>'Redes sociales','social_desc'=>'Activa/desactiva iconos y cambia sus enlaces.','enabled'=>'Activo','link'=>'Enlace','diagnostic'=>'Diagnóstico','php_version'=>'PHP','mssql_ext'=>'Extensión MSSQL','sql_connection'=>'Conexión SQL','current_hero'=>'Hero actual','current_index'=>'Fondo index','success_saved'=>'Cambios guardados correctamente.','confirm_delete'=>'¿Eliminar este elemento?','choose_image'=>'Selecciona una imagen.','invalid_image'=>'Formato inválido. Usa JPG, PNG o GIF.','upload_fail'=>'No se pudo guardar el archivo. Revisa permisos.','file_too_big'=>'La imagen debe tener máximo 5 MB.','title'=>'Título'
        ),
        'en'=>array(
            'dashboard'=>'Dashboard','rankings'=>'Rankings','characters'=>'Characters','downloads'=>'Downloads','vipcoins'=>'VIP & Coins','support'=>'Support','admin'=>'Administration','login'=>'Login','logout'=>'Logout','visitor'=>'Visitor','login_hint'=>'Sign in to your account','administrator'=>'Administrator','player'=>'Player','search'=>'Search player, ranking or resource...','online'=>'online','footer_text'=>'MU Online Dashboard','language'=>'Language',
            'top_agent'=>'TOP AGENT','hero_desc'=>'Your server command center. Rankings, account, character, VIP and coins in one premium interface.','resets'=>'Resets','level'=>'Level','class'=>'Class','your_account'=>'YOUR ACCOUNT','plan'=>'Plan','open_account'=>'Open my account','connect'=>'Connect','connect_desc'=>'Sign in to see your characters and balance.','login_now'=>'Login now','agents'=>'AGENTS','top_characters'=>'Top characters','view_all'=>'View all','top_killers'=>'TOP KILLERS','server'=>'Server','connected_players'=>'Connected players','database'=>'Database','status'=>'STATUS',
            'competitive'=>'COMPETITIVE','server_rankings'=>'Server rankings','master_reset'=>'Master Reset','kills'=>'Kills','deads'=>'Deaths','no_data'=>'No data to display.','my_account'=>'MY ACCOUNT','characters_count'=>'Characters','no_characters'=>'No characters found.','upgrade'=>'UPGRADE','vip_plans'=>'VIP Plans','vip_desc'=>'Explore available plans and benefits.','basic_access'=>'Basic server access.','more_advantages'=>'More advantages for progression.','premium_experience'=>'Complete premium experience.','buy'=>'Buy','help_center'=>'HELP CENTER','fast_help'=>'Fast help for questions and access issues.','open_whatsapp'=>'Open WhatsApp','community_help'=>'Community, news, events and support.','join_discord'=>'Join Discord',
            'client'=>'CLIENT','downloads_title'=>'Downloads','downloads_desc'=>'Essential files to start playing.','download'=>'Download','size'=>'Size','no_downloads'=>'No downloads registered.','secure_access'=>'SECURE ACCESS','login_panel'=>'Sign in','account'=>'Account','password'=>'Password','no_account'=>'No account yet?','create_account'=>'Create account','new_account'=>'NEW ACCOUNT','join_server'=>'Join the server','name'=>'Name','email'=>'Email','create'=>'Create account','fill_fields'=>'Fill in all fields.','invalid_login'=>'Invalid login or password.','db_unavailable'=>'Database unavailable.','account_exists'=>'This account already exists.','account_created'=>'Account created successfully. You can now sign in.','modal_close'=>'Close','register'=>'Register',
            'admin_panel'=>'ADMIN PANEL','portal_control'=>'Administration center','portal_control_desc'=>'Manage appearance, downloads and social networks without editing code.','appearance'=>'Appearance','hero_background'=>'Hero panel background','hero_help'=>'Image for the main index block (panel hero-card).','upload_apply'=>'Upload and apply','use_path'=>'Use path/URL','save'=>'Save','index_background'=>'Index background','background_mode'=>'Background mode','gradient'=>'Gradient','image_gradient'=>'Image + fade','color_1'=>'Start color','color_2'=>'End color','background_image'=>'Background image','fade_strength'=>'Fade strength','downloads_manage'=>'Manage downloads','add_download'=>'Add download','edit_download'=>'Edit download','description'=>'Description','button_link'=>'Button link','actions'=>'Actions','edit'=>'Edit','delete'=>'Delete','cancel'=>'Cancel','social_manage'=>'Social networks','social_desc'=>'Enable/disable icons and change their links.','enabled'=>'Enabled','link'=>'Link','diagnostic'=>'Diagnostics','php_version'=>'PHP','mssql_ext'=>'MSSQL extension','sql_connection'=>'SQL connection','current_hero'=>'Current hero','current_index'=>'Index background','success_saved'=>'Changes saved successfully.','confirm_delete'=>'Delete this item?','choose_image'=>'Select an image.','invalid_image'=>'Invalid format. Use JPG, PNG or GIF.','upload_fail'=>'Could not save the file. Check permissions.','file_too_big'=>'Image must be no larger than 5 MB.','title'=>'Title'
        ),
        'vi'=>array(
            'dashboard'=>'Bảng điều khiển','rankings'=>'Xếp hạng','characters'=>'Nhân vật','downloads'=>'Tải xuống','vipcoins'=>'VIP & Coin','support'=>'Hỗ trợ','admin'=>'Quản trị','login'=>'Đăng nhập','logout'=>'Đăng xuất','visitor'=>'Khách','login_hint'=>'Đăng nhập tài khoản','administrator'=>'Quản trị viên','player'=>'Người chơi','search'=>'Tìm người chơi, xếp hạng hoặc tài nguyên...','online'=>'trực tuyến','footer_text'=>'Bảng điều khiển MU Online','language'=>'Ngôn ngữ',
            'top_agent'=>'TOP NHÂN VẬT','hero_desc'=>'Trung tâm máy chủ của bạn. Xếp hạng, tài khoản, nhân vật, VIP và coin trong giao diện cao cấp.','resets'=>'Reset','level'=>'Cấp','class'=>'Lớp','your_account'=>'TÀI KHOẢN','plan'=>'Gói','open_account'=>'Mở tài khoản','connect'=>'Kết nối','connect_desc'=>'Đăng nhập để xem nhân vật và số dư.','login_now'=>'Đăng nhập','agents'=>'NHÂN VẬT','top_characters'=>'Nhân vật hàng đầu','view_all'=>'Xem tất cả','top_killers'=>'TOP KILLER','server'=>'Máy chủ','connected_players'=>'Người chơi online','database'=>'Cơ sở dữ liệu','status'=>'TRẠNG THÁI',
            'competitive'=>'CẠNH TRANH','server_rankings'=>'Xếp hạng máy chủ','master_reset'=>'Master Reset','kills'=>'Kills','deads'=>'Deaths','no_data'=>'Không có dữ liệu.','my_account'=>'TÀI KHOẢN CỦA TÔI','characters_count'=>'Nhân vật','no_characters'=>'Không tìm thấy nhân vật.','upgrade'=>'NÂNG CẤP','vip_plans'=>'Gói VIP','vip_desc'=>'Khám phá các gói và quyền lợi.','basic_access'=>'Quyền truy cập cơ bản.','more_advantages'=>'Nhiều lợi ích hơn để phát triển.','premium_experience'=>'Trải nghiệm cao cấp đầy đủ.','buy'=>'Mua','help_center'=>'TRUNG TÂM HỖ TRỢ','fast_help'=>'Hỗ trợ nhanh các vấn đề truy cập.','open_whatsapp'=>'Mở WhatsApp','community_help'=>'Cộng đồng, tin tức, sự kiện và hỗ trợ.','join_discord'=>'Vào Discord',
            'client'=>'CLIENT','downloads_title'=>'Tải xuống','downloads_desc'=>'Các tệp cần thiết để bắt đầu chơi.','download'=>'Tải xuống','size'=>'Kích thước','no_downloads'=>'Chưa có tệp tải xuống.','secure_access'=>'TRUY CẬP AN TOÀN','login_panel'=>'Đăng nhập','account'=>'Tài khoản','password'=>'Mật khẩu','no_account'=>'Chưa có tài khoản?','create_account'=>'Tạo tài khoản','new_account'=>'TÀI KHOẢN MỚI','join_server'=>'Tham gia máy chủ','name'=>'Tên','email'=>'Email','create'=>'Tạo tài khoản','fill_fields'=>'Vui lòng điền đầy đủ thông tin.','invalid_login'=>'Sai tài khoản hoặc mật khẩu.','db_unavailable'=>'Cơ sở dữ liệu không khả dụng.','account_exists'=>'Tài khoản đã tồn tại.','account_created'=>'Tạo tài khoản thành công. Bạn có thể đăng nhập.','modal_close'=>'Đóng','register'=>'Đăng ký',
            'admin_panel'=>'BẢNG QUẢN TRỊ','portal_control'=>'Trung tâm quản trị','portal_control_desc'=>'Quản lý giao diện, tải xuống và mạng xã hội không cần sửa mã.','appearance'=>'Giao diện','hero_background'=>'Nền Hero','hero_help'=>'Ảnh nền cho khối chính index (panel hero-card).','upload_apply'=>'Tải lên và áp dụng','use_path'=>'Dùng đường dẫn/URL','save'=>'Lưu','index_background'=>'Nền trang index','background_mode'=>'Kiểu nền','gradient'=>'Gradient','image_gradient'=>'Ảnh + fade','color_1'=>'Màu đầu','color_2'=>'Màu cuối','background_image'=>'Ảnh nền','fade_strength'=>'Độ mờ fade','downloads_manage'=>'Quản lý tải xuống','add_download'=>'Thêm tải xuống','edit_download'=>'Sửa tải xuống','description'=>'Mô tả','button_link'=>'Liên kết nút','actions'=>'Thao tác','edit'=>'Sửa','delete'=>'Xóa','cancel'=>'Hủy','social_manage'=>'Mạng xã hội','social_desc'=>'Bật/tắt biểu tượng và thay đổi liên kết.','enabled'=>'Bật','link'=>'Liên kết','diagnostic'=>'Chẩn đoán','php_version'=>'PHP','mssql_ext'=>'Tiện ích MSSQL','sql_connection'=>'Kết nối SQL','current_hero'=>'Hero hiện tại','current_index'=>'Nền index','success_saved'=>'Đã lưu thay đổi.','confirm_delete'=>'Xóa mục này?','choose_image'=>'Chọn ảnh.','invalid_image'=>'Định dạng không hợp lệ. Dùng JPG, PNG hoặc GIF.','upload_fail'=>'Không thể lưu tệp. Kiểm tra quyền.','file_too_big'=>'Ảnh tối đa 5 MB.','title'=>'Tiêu đề'
        ),
        'zh'=>array(
            'dashboard'=>'控制面板','rankings'=>'排行榜','characters'=>'角色','downloads'=>'下载','vipcoins'=>'VIP 与金币','support'=>'支持','admin'=>'管理','login'=>'登录','logout'=>'退出','visitor'=>'访客','login_hint'=>'请登录账户','administrator'=>'管理员','player'=>'玩家','search'=>'搜索玩家、排行或资源...','online'=>'在线','footer_text'=>'MU Online 控制面板','language'=>'语言',
            'top_agent'=>'顶级角色','hero_desc'=>'服务器中心：排行榜、账户、角色、VIP 和金币集中在高级界面中。','resets'=>'转生','level'=>'等级','class'=>'职业','your_account'=>'您的账户','plan'=>'方案','open_account'=>'打开我的账户','connect'=>'连接账户','connect_desc'=>'登录后查看角色和余额。','login_now'=>'立即登录','agents'=>'角色','top_characters'=>'顶级角色','view_all'=>'查看全部','top_killers'=>'顶级杀手','server'=>'服务器','connected_players'=>'在线玩家','database'=>'数据库','status'=>'状态',
            'competitive'=>'竞技','server_rankings'=>'服务器排行榜','master_reset'=>'大师转生','kills'=>'击杀','deads'=>'死亡','no_data'=>'暂无数据。','my_account'=>'我的账户','characters_count'=>'角色','no_characters'=>'未找到角色。','upgrade'=>'升级','vip_plans'=>'VIP 方案','vip_desc'=>'查看可用方案与福利。','basic_access'=>'基础服务器访问。','more_advantages'=>'更多成长优势。','premium_experience'=>'完整高级体验。','buy'=>'购买','help_center'=>'帮助中心','fast_help'=>'快速解决访问问题。','open_whatsapp'=>'打开 WhatsApp','community_help'=>'社区、新闻、活动和支持。','join_discord'=>'加入 Discord',
            'client'=>'客户端','downloads_title'=>'下载','downloads_desc'=>'开始游戏所需文件。','download'=>'下载','size'=>'大小','no_downloads'=>'暂无下载。','secure_access'=>'安全访问','login_panel'=>'登录面板','account'=>'账户','password'=>'密码','no_account'=>'还没有账户？','create_account'=>'创建账户','new_account'=>'新账户','join_server'=>'加入服务器','name'=>'姓名','email'=>'邮箱','create'=>'创建账户','fill_fields'=>'请填写所有字段。','invalid_login'=>'账户或密码无效。','db_unavailable'=>'数据库不可用。','account_exists'=>'该账户已存在。','account_created'=>'账户创建成功，现在可以登录。','modal_close'=>'关闭','register'=>'注册',
            'admin_panel'=>'管理员面板','portal_control'=>'管理中心','portal_control_desc'=>'无需编辑代码即可管理外观、下载和社交网络。','appearance'=>'外观','hero_background'=>'Hero 面板背景','hero_help'=>'首页主区块 (panel hero-card) 的背景图。','upload_apply'=>'上传并应用','use_path'=>'使用路径/URL','save'=>'保存','index_background'=>'首页背景','background_mode'=>'背景模式','gradient'=>'渐变','image_gradient'=>'图片 + 淡化','color_1'=>'起始颜色','color_2'=>'结束颜色','background_image'=>'背景图片','fade_strength'=>'淡化强度','downloads_manage'=>'管理下载','add_download'=>'添加下载','edit_download'=>'编辑下载','description'=>'描述','button_link'=>'按钮链接','actions'=>'操作','edit'=>'编辑','delete'=>'删除','cancel'=>'取消','social_manage'=>'社交网络','social_desc'=>'启用/停用图标并修改链接。','enabled'=>'启用','link'=>'链接','diagnostic'=>'诊断','php_version'=>'PHP','mssql_ext'=>'MSSQL 扩展','sql_connection'=>'SQL 连接','current_hero'=>'当前 Hero','current_index'=>'首页背景','success_saved'=>'更改已保存。','confirm_delete'=>'删除此项目？','choose_image'=>'请选择图片。','invalid_image'=>'格式无效，请使用 JPG、PNG 或 GIF。','upload_fail'=>'无法保存文件，请检查权限。','file_too_big'=>'图片最大 5 MB。','title'=>'标题'
        ));
    }
    $lang=current_lang();
    if (isset($tr[$lang][$key])) return $tr[$lang][$key];
    return isset($tr['pt'][$key]) ? $tr['pt'][$key] : $key;
}

function vip_nome($level) { $level=intval($level); if($level==1)return 'Silver'; if($level==2)return 'Prata'; if($level==3)return 'Gold'; return 'Free'; }
function classe_nome($class) {
    $c=intval($class); $map=array(0=>'Dark Wizard',1=>'Soul Master',2=>'Grand Master',16=>'Dark Knight',17=>'Blade Knight',18=>'Blade Master',32=>'Fairy Elf',33=>'Muse Elf',34=>'High Elf',48=>'Magic Gladiator',50=>'Duel Master',64=>'Dark Lord',66=>'Lord Emperor',80=>'Summoner',81=>'Bloody Summoner',82=>'Dimension Master',96=>'Rage Fighter',98=>'Fist Master');
    return isset($map[$c])?$map[$c]:'Class '.$c;
}
function format_num($n) { return number_format(intval($n),0,',','.'); }

function get_account_data($account) {
    $out=array('AccountLevel'=>0,'AccountExpireDate'=>'','level'=>0,'mail_addr'=>''); if(!db_ok())return $out;
    $acc=sql_escape($account); $q=@mssql_query("SELECT TOP 1 AccountLevel, AccountExpireDate, level, mail_addr FROM MEMB_INFO WHERE memb___id='".$acc."'");
    if($q&&($r=@mssql_fetch_assoc($q)))return $r; return $out;
}
function get_cash_data($account) {
    $out=array('WCoinC'=>0,'WCoinP'=>0,'GoblinPoint'=>0); if(!db_ok())return $out;
    $acc=sql_escape($account); $q=@mssql_query("SELECT TOP 1 WCoinC,WCoinP,GoblinPoint FROM CashShopData WHERE AccountID='".$acc."'"); if($q&&($r=@mssql_fetch_assoc($q)))return $r; return $out;
}
function get_online_status($account) {
    $out=array('ConnectStat'=>0,'ServerName'=>'','ConnectTM'=>'','OnlineHours'=>0); if(!db_ok())return $out;
    $acc=sql_escape($account); $q=@mssql_query("SELECT TOP 1 ConnectStat,ServerName,ConnectTM,OnlineHours FROM MEMB_STAT WHERE memb___id='".$acc."'"); if($q&&($r=@mssql_fetch_assoc($q)))return $r; return $out;
}
function get_characters($account) {
    $rows=array(); if(!db_ok())return $rows; $acc=sql_escape($account);
    $q=@mssql_query("SELECT Name,cLevel,Class,ResetCount,MasterResetCount,Kills,Deads,Money,MapNumber,image FROM Character WHERE AccountID='".$acc."' ORDER BY ResetCount DESC,cLevel DESC"); if($q)while($r=@mssql_fetch_assoc($q))$rows[]=$r; return $rows;
}
function top_players($limit) {
    $rows=array(); if(!db_ok())return $rows; $limit=intval($limit); if($limit<1)$limit=5; if($limit>100)$limit=100;
    $q=@mssql_query("SELECT TOP ".$limit." Name,Class,cLevel,ResetCount,MasterResetCount,Kills,Deads,image FROM Character WHERE (CtlCode=0 OR CtlCode IS NULL) ORDER BY ResetCount DESC,cLevel DESC"); if($q)while($r=@mssql_fetch_assoc($q))$rows[]=$r; return $rows;
}
function top_killers($limit) {
    $rows=array(); if(!db_ok())return $rows; $limit=intval($limit); if($limit<1)$limit=5;
    $q=@mssql_query("SELECT TOP ".$limit." Name,Class,Kills,Deads,ResetCount FROM Character WHERE (CtlCode=0 OR CtlCode IS NULL) ORDER BY Kills DESC,Deads ASC"); if($q)while($r=@mssql_fetch_assoc($q))$rows[]=$r; return $rows;
}
function total_online() { if(!db_ok())return 0; $q=@mssql_query("SELECT COUNT(*) AS total FROM MEMB_STAT WHERE ConnectStat=1"); if($q&&($r=@mssql_fetch_assoc($q)))return intval($r['total']); return 0; }

function safe_hex($v,$fallback) { return preg_match('/^#[0-9A-Fa-f]{6}$/',$v)?$v:$fallback; }
function index_bg_config() {
    $d=array('mode'=>'gradient','color1'=>'#090816','color2'=>'#17102b','image'=>'assets/default-bg.jpg','fade'=>'88');
    $r=read_kv_file('index_background.txt',$d); $r['color1']=safe_hex($r['color1'],$d['color1']); $r['color2']=safe_hex($r['color2'],$d['color2']);
    $r['fade']=intval($r['fade']); if($r['fade']<0)$r['fade']=0; if($r['fade']>100)$r['fade']=100; if($r['mode']!='image')$r['mode']='gradient'; return $r;
}
function index_background_style() {
    $c=index_bg_config();
    if($c['mode']=='image' && trim($c['image'])!='') {
        $a=$c['fade']/100; return "background-image:linear-gradient(135deg,rgba(9,8,22,".$a."),rgba(23,16,43,".$a.")),url('".h($c['image'])."');background-size:cover;background-position:center;background-attachment:fixed;";
    }
    return "background-image:linear-gradient(135deg,".$c['color1'].",".$c['color2'].");background-attachment:fixed;";
}
function hero_background() { return read_text_file('hero_background.txt','assets/default-bg.jpg'); }
function hero_background_style() { $v=hero_background(); return "background-image:linear-gradient(110deg,rgba(208,68,174,.83),rgba(90,69,210,.75)),url('".h($v)."');background-size:cover;background-position:center;"; }

function upload_image_generic($field,$prefix) {
    if(!isset($_FILES[$field])||!is_array($_FILES[$field]))return array(false,t('choose_image'));
    $f=$_FILES[$field]; if(intval($f['error'])!==0)return array(false,t('choose_image'));
    if(intval($f['size'])>5*1024*1024)return array(false,t('file_too_big'));
    $ext=strtolower(pathinfo($f['name'],PATHINFO_EXTENSION)); if(!in_array($ext,array('jpg','jpeg','png','gif')))return array(false,t('invalid_image'));
    $name=$prefix.'_'.date('Ymd_His').'_'.mt_rand(1000,9999).'.'.$ext; $dest=UPLOAD_BG_DIR.'/'.$name;
    if(!@move_uploaded_file($f['tmp_name'],$dest))return array(false,t('upload_fail'));
    return array(true,'uploads/backgrounds/'.$name);
}

function download_encode($v) { return base64_encode($v); }
function download_decode($v) { $x=base64_decode($v); return $x===false?'':$x; }
function get_downloads() {
    $rows=array(); $file=data_file('downloads.txt'); if(!file_exists($file))return $rows; $lines=@file($file,FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES); if(!$lines)return $rows;
    foreach($lines as $line){ $p=explode('|',$line); if(count($p)<5)continue; $rows[]=array('id'=>$p[0],'name'=>download_decode($p[1]),'description'=>download_decode($p[2]),'link'=>download_decode($p[3]),'size'=>download_decode($p[4])); }
    return $rows;
}
function save_downloads($rows) {
    $out=array(); foreach($rows as $r)$out[]=$r['id'].'|'.download_encode($r['name']).'|'.download_encode($r['description']).'|'.download_encode($r['link']).'|'.download_encode($r['size']);
    return @file_put_contents(data_file('downloads.txt'),implode("\n",$out).(count($out)?"\n":''),LOCK_EX)!==false;
}
function find_download($id) { $rows=get_downloads(); foreach($rows as $r)if($r['id']==$id)return $r; return false; }

function social_defaults() {
    return array(
      'youtube'=>array('enabled'=>0,'url'=>'https://youtube.com/'),
      'discord'=>array('enabled'=>0,'url'=>'https://discord.com/'),
      'instagram'=>array('enabled'=>0,'url'=>'https://instagram.com/'),
      'facebook'=>array('enabled'=>0,'url'=>'https://facebook.com/'),
      'linkedin'=>array('enabled'=>0,'url'=>'https://linkedin.com/'),
      'whatsapp'=>array('enabled'=>0,'url'=>'https://wa.me/')
    );
}
function get_socials() {
    $out=social_defaults(); $file=data_file('socials.txt'); if(!file_exists($file))return $out; $lines=@file($file,FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES); if(!$lines)return $out;
    foreach($lines as $line){$p=explode('|',$line,3); if(count($p)<3||!isset($out[$p[0]]))continue; $out[$p[0]]['enabled']=intval($p[1])?1:0; $out[$p[0]]['url']=download_decode($p[2]);}
    return $out;
}
function save_socials($s) { $rows=array(); foreach($s as $k=>$v)$rows[]=$k.'|'.(intval($v['enabled'])?1:0).'|'.download_encode($v['url']); return @file_put_contents(data_file('socials.txt'),implode("\n",$rows)."\n",LOCK_EX)!==false; }
function social_label($k){$m=array('youtube'=>'YouTube','discord'=>'Discord','instagram'=>'Instagram','facebook'=>'Facebook','linkedin'=>'LinkedIn','whatsapp'=>'WhatsApp');return isset($m[$k])?$m[$k]:$k;}
function social_icon($k){$m=array('youtube'=>'▶','discord'=>'◉','instagram'=>'◎','facebook'=>'f','linkedin'=>'in','whatsapp'=>'☎');return isset($m[$k])?$m[$k]:'•';}

function page_title($title) { return h($title).' - '.h(SITE_NAME); }
function nav_active($file) { return basename($_SERVER['PHP_SELF'])==$file?'active':''; }
function lang_url($code) { $uri=isset($_SERVER['REQUEST_URI'])?$_SERVER['REQUEST_URI']:'index.php'; $uri=preg_replace('/([?&])lang=[^&]*/','$1',$uri); $uri=str_replace('?&','?',$uri); $uri=rtrim($uri,'?&'); return $uri.(strpos($uri,'?')===false?'?':'&').'lang='.$code; }
?>
