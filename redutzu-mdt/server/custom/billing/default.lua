CreateThread(function()
    if Config.BillingScript ~= 'default' then
        return
    end

    function SendPlayerBill(identifier, amount)
        local player = ESX.GetPlayerFromIdentifier(identifier)
        local message = replace_all(Config.Messages['player:fine'], {
            amount = amount
        })

        player.removeAccountMoney('bank', amount)

        Config.Notify(player.source, message, 'error')
    end
end)