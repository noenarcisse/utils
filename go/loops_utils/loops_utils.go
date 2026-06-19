package loops_utils

import (
	"iter"
)

// F# seq{1..1..10}
func ByStep(from, step, to int) iter.Seq[int] {
	return func(yield func(int) bool) {
		for i := from; i <= to; i += step {
			if !yield(i) {
				return
			}
		}
	}
}

// Kt repeat(x)
func Repeat(n int) iter.Seq[int] {
	return func(yield func(int) bool) {
		for i := range n {
			if !yield(i) {
				return
			}
		}
	}
}
