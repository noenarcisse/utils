package json_utils

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
)

// C#-like shorthand to get and unmarshall a json object
// Returns the object T or an error
func GetFromJson[T any](url string) (T, error) {
	var result T
	res, err := http.Get(url)
	if err != nil {
		return result, errors.New("GetFromJson http error: " + err.Error())
	}

	//gestion du code de retour autre que 200 ? ou on le forward ?

	defer res.Body.Close()

	err = json.NewDecoder(res.Body).Decode(&result)
	if err != nil {
		return result, errors.New("GetFromJson json decode: " + err.Error())
	}
	return result, nil
}

// C#-like shorthand to post and marshall an object
// Returns the http response or an error
// Caller should close the res.Body
func PostAsJson[T any](url string, obj T) (*http.Response, error) {
	body := bytes.Buffer{}
	err := json.NewEncoder(&body).Encode(obj)
	if err != nil {
		return nil, err
	}

	res, err := http.Post(url, "application/json", &body)
	return res, err
}

//etendre une variable func PostAsJson[T any, R any](url string, obj T) (R, error) {
// pour return direct un dto ?
