local chatMessages = {}

RegisterCallback("SendChatMessage", function(source, cb, messageData)
    local player = ESX.GetPlayerFromId(source)
    
    -- Get player profile data
    local playerProfile = Database.fetchSingle({
        table = Config.Tables.players,
        condition = Config.Queries["search:citizen"],
        parameters = { query = player.identifier }
    })
    
    -- Create chat message object
    local chatMessage = {
        content = messageData.content,
        timestamp = messageData.timestamp,
        author = string.format("%s %s", playerProfile.firstname, playerProfile.lastname),
        image = playerProfile.mdt_image,
        identifier = player.identifier
    }
    
    -- Add message to chat history
    local messageIndex = #chatMessages + 1
    chatMessages[messageIndex] = chatMessage
    
    -- Send to webhook if configured
    if Config.Webhooks.chat then
        SendEmbed("chat", {
            title = "New chat message | " .. chatMessage.author,
            description = chatMessage.content
        })
    end
    
    -- Sync chat with all clients
    TriggerClientEvent("rz-core:client:sync-chat", -1, chatMessages)
    
    cb("ok")
end)

RegisterCallback("GetChatMessages", function(source, cb)
    cb(chatMessages)
end)