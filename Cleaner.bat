@echo off

:: (Run as Admin code starts)
REM  Check for permissions
>nul 2>&1 "%SYSTEMROOT%\system32\icacls.exe" "%SYSTEMROOT%\system32\config\system"

REM If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Now Running As Administrative Privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"
:: (Run as Admin code ends)
::=======================================
::=======================================


:: (Your code is start from here:)
::===========================>

@echo off
color 1E
Title Clear Command by https://cod-cheat.com/
echo This delete will stop your update running service and deleting "Update files"
echo Are your sure want to clean and delete files?
Pause
echo.
cls
echo.
cls
echo.
echo.
echo Loading Please Wait...
echo ----------------------------------
echo Progress:  = 1%%
echo =========================================================================================== 
echo Last Clear Time: %DATE% %TIME% 
echo =========================================================================================== 
echo 1) Current Windows Temp Folder files 
Tree %windir%\Temp /F /A 
echo =========================================================================================== 
echo 1) Deleting Windows Temp Folder 
del /s /f /q %windir%\Temp\*.* 
rd /s /q %windir%\Temp 
md %windir%\Temp 
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading Please Wait...
echo ----------------------------------
echo Progress: == 2%%
echo =========================================================================================== 
echo 2) Current Local %Temp% Folder files 
Tree %USERPROFILE%\APPDATA\Local\Temp /F /A 
echo =========================================================================================== 
echo 2) Deleting Local %Temp% Folder 
del /s /f /q %Temp%\*.* 
rd /s /q %Temp% 
md %Temp%\ 
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading Please Wait...
echo ----------------------------------
echo Progress: == 3%%
echo =========================================================================================== 
echo 3) Current Windows Prefetch Folder files 
Tree %windir%\Prefetch /F /A 
echo =========================================================================================== 
echo 3) Deleting Windows Prefetch Folder 
del /s /f /q %windir%\Prefetch\*.* 
rd /s /q %windir%\Prefetch 
md %windir%\Prefetch 
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading Please Wait...
echo ----------------------------------
echo Progress: === 10%%
echo =========================================================================================== 
echo 4) Current User Local Setting Temp Folder files 
Tree %USERPROFILE%\APPDATA\Local\Temp /F /A 
echo =========================================================================================== 
echo 4) Deleting User Local Setting Temp Folder 
del /s /f /q "%USERPROFILE%\Local Settings\Temp"\*.* 
rd /s /q "%USERPROFILE%\Local Settings\Temp" 
md "%USERPROFILE%\Local Settings\Temp" 
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading Please Wait...
echo ----------------------------------
echo Progress: ==== 15%%
echo =========================================================================================== 
echo 5) Current Recent Folder from Windows 10/11 only files 
Tree "%APPDATA%\Microsoft\Windows\Recent" /F /A 
echo =========================================================================================== 
echo 5) Deleting Recent Folder from Windows 10/11 only 
del /s /f /q "%APPDATA%\Microsoft\Windows\Recent"\*.* 
rd /s /q "%APPDATA%\Microsoft\Windows\Recent" 
md "%APPDATA%\Microsoft\Windows\Recent" 
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading Please Wait...
echo ----------------------------------
echo Progress: ===== 20%%
echo =========================================================================================== 
echo 6) Current Recent Explor Folder from Windows 10/11 only files 
Tree "%APPDATA%\Microsoft\Windows\Recent\AutomaticDestinations" /F /A 
echo =========================================================================================== 
echo 6) Deleting Recent Explor Folder from Windows 10/11 only 
del /s /f /q "%APPDATA%\Microsoft\Windows\Recent\AutomaticDestinations"\*.* 
rd /s /q "%APPDATA%\Microsoft\Windows\Recent\AutomaticDestinations" 
md "%APPDATA%\Microsoft\Windows\Recent\AutomaticDestinations" 
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading Please Wait...
echo ----------------------------------
echo Progress: ====== 25%%
echo =========================================================================================== 
echo 7) Current Recent Custom Explor Folder from Windows 10/11 only files 
Tree "%APPDATA%\Microsoft\Windows\Recent\CustomDestinations" /F /A 
echo =========================================================================================== 
echo 7) Deleting Recent Custom Explor Folder from Windows 10/11 only 
del /s /f /q "%APPDATA%\Microsoft\Windows\Recent\CustomDestinations"\*.* 
rd /s /q "%APPDATA%\Microsoft\Windows\Recent\CustomDestinations" 
md "%APPDATA%\Microsoft\Windows\Recent\CustomDestinations" 
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading Please Wait...
echo ----------------------------------
echo Progress: ======= 30%%
echo =========================================================================================== 
echo 8) Current Run Command History from Registry files 
REG Query HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\RunMRU 
echo =========================================================================================== 
echo 8) Deleting Run Command History from Registry 
REG Query HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\RunMRU 
REG Delete HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\RunMRU /VA /F 
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading Please Wait...
echo ----------------------------------
echo Progress: ======== 35%%
echo =========================================================================================== 
echo 9) Current Run Command History from Registry files 
REG Query HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\TypedPaths 
echo =========================================================================================== 
echo 9) Deleting Path History from File Explorer Registry 
REG Delete HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\TypedPaths /VA /F 
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading Please Wait...
echo ----------------------------------
echo Progress: ========= 40%%
echo =========================================================================================== 
echo 10) Current Windows Prefetch Folder files 
Tree %windir%\Prefetch /F /A 
echo =========================================================================================== 
echo 10) Deleting Windows Prefetch Folder 
del C:\Windows\Prefetch\*.* /Q 
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading Please Wait...
echo ----------------------------------
echo Progress: ========== 45%%
echo =========================================================================================== 
echo 11) Current Windows .bak files 
Tree %windir%\Prefetch /F /A 
echo =========================================================================================== 
echo 11) Deleting Windows .bak files 
del /s /q /f c:\*.bak 
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading Please Wait Almost Done...
echo ----------------------------------
echo Progress: =========== 50%%
echo =========================================================================================== 
echo 12) Current Windows Update Download files 
Tree %windir%\softwaredistribution /F /A 
echo =========================================================================================== 
echo 12) Deleting Current Windows Update Download files 
net stop wuauserv 
rmdir %windir%\softwaredistribution  /s /q 
net start wuauserv 
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading Please Wait...
echo ----------------------------------
echo Progress: ============ 55%%
echo =========================================================================================== 
echo 13) Current Recyclebin files 
Tree c:\$Recycle.bin /F /A 
Tree d:\$Recycle.bin /F /A 
Tree e:\$Recycle.bin /F /A 
echo =========================================================================================== 
echo 13) Deleting Recyclebin Files 
del c:\$Recycle.bin\*.* /f /s /q 
del d:\$Recycle.bin\*.* /f /s /q 
del e:\$Recycle.bin\*.* /f /s /q 
call powershell.exe Clear-RecycleBin -force -ErrorAction:Ignore 
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading Please Wait Almost Done...
echo ----------------------------------
echo Progress: ============== 60%%
echo =========================================================================================== 
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading Please Wait Almost Done...
echo ----------------------------------
echo Progress: =============== 65%%
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading...
echo ----------------------------------
echo Progress: ================ 70%%
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading...
echo ----------------------------------
echo Progress: ================== 80%%
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading...
echo ----------------------------------
echo Progress: =================== 85%%
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading...
echo ----------------------------------
echo Progress: ==================== 90%%
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading...
echo ----------------------------------
echo Progress: ===================== 95%%
echo ----------------------------------
ping -n 1 localhost >nul
cls
echo.
echo.
echo Loading...
echo ----------------------------------
echo Progress: ====================== 100%%
echo ----------------------------------
GOTO END
:END
cls
echo.
echo.
echo Clear Files Successfully complete...
echo ----------------------------------
echo Progress: ====================== 100%%
echo.
echo.
Color 1A

echo ===========================================================================================
echo Last Clear Time: %DATE% %TIME%
echo ===========================================================================================
for /F %%a in ('echo prompt $E ^| cmd') do set "ESC=%%a"
echo ===========================================================================================%ESC%[1;31m
echo Deleting Temp, Prefetch, Recent, Windows Update Files, Empty Recyclebin, Explor Folder, Run Command, .bak%ESC%[1;32m
echo ===========================================================================================
echo Please Check this Deleting History Log file Where you Run this Command from a Folder
echo ===========================================================================================%ESC%[1;31m



echo Do Not Delete This Folder Or It Contents.
echo ====================================================================================================================
echo %windir%\installer

Pause