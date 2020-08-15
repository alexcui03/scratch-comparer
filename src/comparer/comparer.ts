import Loader from '../loader/loader';

class CompareResult {
    public similarity: number;
    public detail;
}

abstract class Comparer {
    protected srcLoader: Loader;
    protected dstLoader: Loader; 

    constructor(src: Loader, dst: Loader) {
        this.srcLoader = src;
        this.dstLoader = dst;
    }

    public abstract compare(): CompareResult;
}

export { Comparer as default, CompareResult };
