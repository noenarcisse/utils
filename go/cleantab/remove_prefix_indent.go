package cleantab

import "strings"

//Removes any amount of starting tabs or whitespaces from a multilines string
func RemovePrefixIndent(s string) string {
	split := strings.Split(s, "\n")
	lines := []string{}

	for _, line := range split {
		lines = append(lines, strings.TrimLeft(line, " \t"))
	}
	return strings.Join(lines, "\n")
}
