CreateThread(function()
    if Config.BillingScript ~= 'custom' then
        return
    end

    -- Fine a player
    ---@param identifier string # Target identifier
    ---@param amount number # Fine amount
    ---@param data table # Incident data (id, name, ...)
    ---@param creator table # Officer data (source, name, license)
    function SendPlayerBill(identifier, amount, data, creator)
        local player = ESX.GetPlayerFromIdentifier(identifier)
        local officer = ESX.GetPlayerFromId(creator.source)
        
        -- Do your logic here
    end
end)