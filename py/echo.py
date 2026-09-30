def echo(f) :
    def myinner(*args, **kwargs):
        # print(f"{f.__name__}({args}) \n {f(*args, **kwargs)}")
        print(f.__name__)
        result = f(*args, **kwargs)
        print(result)
        print("------")
        return result
    return myinner