package dotenv

import (
	"bufio"
	"errors"
	"fmt"
	"os"
	"slices"
	"strings"
)

//REFACTO
//couper les repeat de code ou private func interne
//pickdotenv > naming ou double fun ? c'est un set+cherrypick
//ca evite de sortir 2 loops pour rien mais le nom fit pas

// Load environnement variables from the machine then any .env file found in the projet root
func LoadEnvVars(keys ...string) error {

	notfound := ListUnsetEnvVars(keys...)
	if len(notfound) <= 0 {
		return nil
	}

	// stuf to do
	err := PickFromDotEnvFile(notfound...)
	return err

}

// Checks if an environment variables already exists.
// Returns true if found, false otherwise.
func EnvVarExists(key string) bool {
	return os.Getenv(key) != ""
}

// List any environment variables that are not already set.
// Return a slice with the keys.
func ListUnsetEnvVars(keys ...string) (notFound []string) {

	notFound = []string{}

	for _, k := range keys {
		ok := EnvVarExists(k)
		if !ok {
			notFound = append(notFound, k)
			continue
		}
	}
	return notFound
}

// faut returne les clé sans attribuer pour etre clean, comme ca je peux aller chercher
// uniquement ce que j'ai besoin

// Attempts to cherrypick a list of environment variables values from a .env file and set them.
// Returns an error if ???
func PickFromDotEnvFile(keys ...string) error {

	found := 0

	file, err := os.Open(".env")
	if err != nil {
		return err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	lineNum := 1
	for scanner.Scan() {
		line := scanner.Text()

		if strings.TrimSpace(line) == "" || strings.HasPrefix(line, "#") {
			continue
		}

		if !strings.Contains(line, "=") {
			errMsg := fmt.Sprintf("Malformed lines found in the .env on line %d", lineNum)
			lineNum++
			return errors.New(errMsg)
		}

		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			k := strings.TrimSpace(parts[0])
			v := strings.TrimSpace(parts[1])

			if slices.Contains(keys, k) {
				os.Setenv(k, v)
				found++
			}

		}
		lineNum++
	}

	if found < len(keys) {
		return errors.New("All the keys could not be found in the .env file")
	}

	return scanner.Err()
}

// code rep + old, kept as a useful thing for later

// Load anything found in the .env file in the project.
// Returns an error if the .env file cannot be found or its content is off.
func LoadDotEnv() error {

	file, err := os.Open(".env")
	if err != nil {
		return err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	lineNum := 1
	for scanner.Scan() {
		line := scanner.Text()

		if strings.Trim(line, " ") == "" || strings.HasPrefix(line, "#") {
			continue
		}

		if !strings.Contains(line, "=") {
			errMsg := fmt.Sprintf("Malformed lines found in the .env on line %d", lineNum)
			lineNum++
			return errors.New(errMsg)
		}

		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			k := strings.TrimSpace(parts[0])
			v := strings.TrimSpace(parts[1])
			os.Setenv(k, v)
		}
		lineNum++
	}
	return scanner.Err()
}
