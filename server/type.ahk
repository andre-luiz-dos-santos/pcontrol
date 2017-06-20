#NoEnv
#SingleInstance, Off

SendMode Input

DllCall("AttachConsole", "int", -1, "int")

stdin := FileOpen("*", "r`n", "UTF-8")

Loop
{
	line := stdin.ReadLine()
	line := RegExReplace(line, "\r?\n$", "")
	Send % line
}
