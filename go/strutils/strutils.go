package strutils

import "unicode"

func Capitalize(s string) string {
	if s == "" {
		return s
	}

	chars := []rune(s)
	chars[0] = unicode.ToUpper(chars[0])
	return string(chars)
}
