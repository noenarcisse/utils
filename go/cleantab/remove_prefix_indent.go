package cleantab

import "strings"

//Removes any amount of starting tabs or whitespaces from a multilines string
func RemovePrefixIndent(s string) string {
	split := strings.Split(s, "\n")
	builder := strings.Builder{}

	for i, line := range split {
		l := []rune(line)
		untabbedLine := l

		for i := range len(l) {
			if l[i] != ' ' && l[i] != '\t' {
				break
			}
			untabbedLine = l[i+1:]
		}
		builder.WriteString(string(untabbedLine))

		if i != len(split)-1 {
			builder.WriteString("\n")
		}
	}
	return builder.String()
}
