#tryget(k) -> v,ok
def tryGetDict[T,V](dico: dict[T,V], k:T) -> tuple[V|None, bool] :
    return (dico.get(k), k in dico)