package main

import (
	"fmt"
	"os"
	"syscall"

	"github.com/praveenmahasena/attendify/internal"
)


func main(){
	if err:=internal.Run();err!=nil{
		fmt.Fprint(os.Stderr,err)
		// sorry if i got the exit signal number wrong
		syscall.Exit(1)
	}
}
