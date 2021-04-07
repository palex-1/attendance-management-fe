export class Pair<T, K> {
    public key ?: T;
    public value ?: K;

    public static pairOf<R, W>(key?: R, value ?: W): Pair<R, W>{
        let pairs: Pair<R, W> =  new Pair();
        pairs.key = key;
        pairs.value = value;

        return pairs;
    }

}