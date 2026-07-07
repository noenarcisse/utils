package dependenciesinjection

import (
	"errors"
	"fmt"
	"reflect"
)

//TODO
//heavy wip
//faut gerer les errs proprement, tester etc

// est ce qu'on veut une seule val ou plusieurs ? comme en .net avec un ienum<interface> apres possible?
// dans le principe, on veut surtout passer une interface abstr -> une struct concr et pas any en val
type DI struct {
	register map[reflect.Type]any
}

func NewDependencInjector() *DI {
	return &DI{
		map[reflect.Type]any{},
	}
}

// register an interface
func (di *DI) Register(intf any, value any) {

	//on est obligé de passer par l'alias de l'interface en go (*ptr)(value)
	//faut checker le ptr + nil d'abord puis verifier si le ptr fait reference
	//a une interface ou pas
	t := reflect.TypeOf(intf)
	if t.Kind() != reflect.Pointer {
		errMsg := fmt.Sprintf("non %s", t.Kind())
		panic(errMsg)
	}
	t = t.Elem()

	if t.Kind() != reflect.Interface {
		errMsg := fmt.Sprintf("non %s", t.Kind())
		panic(errMsg)
	}

	//faut check value ici? ca devrait etre une struct{} obligatoirement
	//pour passer d'abstrait a concret

	di.register[t] = value
}

// TODO
//
// en fait faut donc -> donner les args manuel et laisse a vide les autre,
// on assigne betement dans l'ordre les args puis
// on tente d'injecter les args vides qui trainent vers la fin et on pas eu de val

// Injecte une func sur base de ce qu'on trouve en di pour les args non définis.
// T est un wrapper qui emballe et garanti les retours de la func appelée
// Requiert une struct facon Resul<T,E> pour fonctionner correctement, configurable par l'appelant
func Inject[T any](di *DI, f any, args ...any) (T, error) {

	var defaultVal T

	t := reflect.TypeOf(f)
	if t.Kind() != reflect.Func {
		return defaultVal, nil
	}

	values := []reflect.Value{}

	argsLen := t.NumIn()
	argsManuels := len(args)

	for i := range argsLen {

		if i < argsManuels {
			values = append(values, reflect.ValueOf(args[i]))
			continue
		}

		at := t.In(i)
		if at.Kind() != reflect.Interface {
			errMsg := fmt.Sprintf("Only interfaces are injectables, found %s", at.Kind())
			return defaultVal, errors.New(errMsg)
		}

		//fmt.Printf("%s - %s\n", at, at.Kind())
		if _, ok := di.register[at]; ok {
			values = append(values, reflect.ValueOf(di.register[at]))
		}
	}

	results := reflect.ValueOf(f).Call(values)

	//empty res, construit un default;
	if len(results) == 0 {
		return defaultVal, nil
	}

	//sinon caste -> intft -> T
	if _, ok := results[0].Interface().(T); !ok {
		//TODO
		//clean err
		return defaultVal, errors.New("NON, err -> result pas castable en T")
	}

	return results[0].Interface().(T), nil
}
