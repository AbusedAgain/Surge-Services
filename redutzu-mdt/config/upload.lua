Upload = {}

Upload.Method = 'discord' -- discord, imgur, custom
Upload.Methods = {
    ['discord'] = {
        link = nil,
        field = 'files[]',
        path = 'attachments.1.url',
        options = {
            encoding = 'png'
        }
    },
    ['imgur'] = {
        link = 'https://api.imgur.com/3/upload',
        field = 'image',
        path = 'data.link',
        options = {
            headers = {
                ['Authorization'] = 'Client-ID YOUR_KEY_HERE'
            }
        }
    },
    ['custom'] = {
        link = 'https://api.your_website.com/api',
        field = 'file',
        path = 'link',
        options = {
            headers = {
                ['Authorization'] = 'Key YOUR_KEY_HERE'
            }
        }
    }
}