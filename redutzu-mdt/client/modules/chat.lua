RegisterNUICallback("SendChatMessage", function(data, cb)
    TriggerCallback("SendChatMessage", cb, data)
end)

RegisterNUICallback("GetChatMessages", function(data, cb)
    TriggerCallback("GetChatMessages", cb, data)
end)

RegisterNetEvent("rz-core:client:sync-chat", function(chatMessages)
    SendNUIMessage({
        action = "SetChatMessages",
        data = chatMessages
    })
end)