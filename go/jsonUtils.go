package main

import (
	"encoding/json"
	"net/http"
)

func getFromJson[T any](url string) (T, error) {
	var result T
	res, err := http.Get(url)
	if err != nil {
		return result, err
	}

	defer res.Body.Close()

	err = json.NewDecoder(res.Body).Decode(&result)
	if err != nil {
		return result, err
	}

	return result, nil
}
