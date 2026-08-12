fx_version 'cerulean'
game 'gta5'

author 'Redutzu'
version '2.1.6'
description '✨ A good looking police MDT'
github 'https://github.com/redutzu'

lua54 'yes'

ui_page 'nui/build/index.html'

shared_scripts {
    'config/shared.lua',
    'config/upload.lua'
}

client_scripts {
    'client/library/callbacks.lua',
    'client/library/misc.lua',
    'client/functions.lua',
    'client/main.lua',
    'client/modules/alerts.lua',
    'client/modules/chat.lua',
    'client/modules/camera.lua',
    'client/modules/mugshot.lua'
}

server_scripts {
	'@oxmysql/lib/MySQL.lua',
	'@mysql-async/lib/MySQL.lua',
    'server/library/callbacks.lua',
    'server/library/database.lua',
    'server/library/misc.lua',
    'server/custom/billing/**.lua',
    'config/server.lua',
    'server/modules/phone.lua',
    'server/custom/phone/**.lua',
    'server/modules/housing.lua',
    'server/custom/housing/**.lua',
    'server/modules/licenses.lua',
    'server/custom/license/**.lua',
    'server/functions.lua',
    'server/main.lua',
    'server/events.lua',
    'server/modules/alerts.lua',
    'server/custom/dispatch/**.lua',
    'server/modules/chat.lua',
    'server/modules/citizens.lua'
}

escrow_ignore {
    'server/custom/**/**',
    'config/**',
    'stream/*'
}

data_file 'DLC_ITYP_REQUEST' 'stream/vpad_prop_1.ytyp'

files {
    'config/settings.js',
    'nui/build/static/css/**',
    'nui/build/static/js/**',
    'nui/build/static/media/**',
    'nui/build/**'
}

dependencies {
    '/assetpacks',
    'screenshot-basic',
    'oxmysql',
    'es_extended'
}
