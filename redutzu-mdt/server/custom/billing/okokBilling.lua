CreateThread(function()
    if Config.BillingScript ~= 'okokBilling' then
        return
    end

    function SendPlayerBill(identifier, amount, data, creator)
        local player = ESX.GetPlayerFromIdentifier(identifier)
        local officer = ESX.GetPlayerFromId(creator.source)
        local name = Config.GetPlayerName(officer)
    
        TriggerEvent('okokBilling:CreateCustomInvoice', player.source, amount, 'Police Incident - ID #' .. data.id, string.format('Fined by Officer %s %s', name.firstname, name.lastname), 'society_police', 'Law Enforcement')
    end
end)