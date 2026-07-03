package dotenv

import (
	"bufio"
	"errors"
	"fmt"
	"maps"
	"os"
	"path"
	"slices"
	"strings"
)

type DotEnvFile struct {
	filePath string
}

// Create a new DotEnv object and checks if the file path is valid.
// Returns the data object or an error.
func NewDotEnvFile(filePath string) (*DotEnvFile, error) {

	if filePath == "" {
		curdir, err := os.Getwd()
		if err != nil {
			return nil, err
		}
		filePath = path.Join(curdir, ".env")
	}

	if _, err := os.Stat(filePath); err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return nil, NewFileNotFoundErr(".env file not found")
		} else {
			return nil, err
		}
	}

	fmt.Println(filePath)

	return &DotEnvFile{
		filePath,
	}, nil
}

// Load environnement variables from the machine then from the .env file
func LoadEnvVars(envfile DotEnvFile, keys ...string) error {

	unset := ListUnsetEnvVars(keys...)
	if len(unset) <= 0 {
		return nil
	}

	found, notfound, err := envfile.PickKeys(unset...)
	if err != nil {
		return err
	}

	if len(notfound) > 0 {
		return NewKeysNotFoundErr(
			"All the keys could not be found in the .env file",
			slices.Collect(maps.Keys(notfound))...,
		)
	}

	for k, v := range found {
		os.Setenv(k, v)
	}
	return nil
}

// Checks if an environment variables already exists.
// Returns true if found, false otherwise.
func EnvVarExists(key string) bool {
	return os.Getenv(key) != ""
}

// List any environment variables that are not already set.
// Return a slice with the unset keys.
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

// Attempts to cherrypick a list of environment variables values from a .env file.
// Returns the keys found and not found
// Returns an error if the file cannot be retrieved or if the content of the file is malformed.
func (f DotEnvFile) PickKeys(keys ...string) (found map[string]string, notfound map[string]struct{}, err error) {

	if len(keys) <= 0 {
		return nil, nil, NewNoKeysErr("Error: no keys to look for")
	}

	found = map[string]string{}
	notfound = map[string]struct{}{}

	for _, k := range keys {
		notfound[k] = struct{}{}
	}

	file, err := os.Open(f.filePath)
	//surcouche de defensif ici, c'est censé etre safe par le ctor de dotenvfile ?
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return nil, nil, NewFileNotFoundErr(".env file not found")
		}
		return nil, nil, err
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
			err = NewMalformedFileErr(errMsg)
			return
		}

		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			k := strings.TrimSpace(parts[0])
			v := strings.TrimSpace(parts[1])

			if slices.Contains(keys, k) {
				found[k] = v
				delete(notfound, k)
			}

		}
		lineNum++
	}

	err = scanner.Err()
	if err != nil {
		return nil, nil, err
	}

	return found, notfound, nil
}
