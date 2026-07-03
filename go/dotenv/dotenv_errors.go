package dotenv

import (
	"fmt"
	"strings"
)

type baseErr struct{ errMsg string }

func (b *baseErr) Error() string {
	return b.errMsg
}

type FileNotFoundErr struct {
	baseErr
}
type MalformedFileErr struct {
	baseErr
}
type NoKeysErr struct {
	baseErr
}
type KeysNotFoundErr struct {
	baseErr
	keysNotFound []string
}

func NewFileNotFoundErr(errMsg string) *FileNotFoundErr {
	return &FileNotFoundErr{
		baseErr{errMsg: errMsg},
	}
}
func NewMalformedFileErr(errMsg string) *MalformedFileErr {
	return &MalformedFileErr{
		baseErr{errMsg: errMsg},
	}
}
func NewKeysNotFoundErr(errMsg string, keys ...string) *KeysNotFoundErr {
	return &KeysNotFoundErr{
		baseErr{errMsg: errMsg},
		keys,
	}
}
func NewNoKeysErr(errMsg string) *NoKeysErr {
	return &NoKeysErr{
		baseErr{errMsg: errMsg},
	}
}
func (e *KeysNotFoundErr) Error() string {
	errMsg := fmt.Sprintf(
		"%s: %s",
		e.errMsg,
		strings.Join(e.keysNotFound, ", "),
	)
	return errMsg
}
