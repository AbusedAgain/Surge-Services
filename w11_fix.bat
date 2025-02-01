@echo off
    
    net session >nul 2>&1
    if %errorLevel% == 0 (
        bcdedit /set hypervisorlaunchtype off
        powershell.exe -ExecutionPolicy Bypass -Command "Disable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All"
	reg add HKLM\SYSTEM\CurrentControlSet\Control\CI\Config /v VulnerableDriverBlocklistEnable /t REG_DWORD /d 0x000000
        echo Done!
        pause>0
        exit

    ) else (
        echo Please run as Administrator.
    )
    
    pause >nul