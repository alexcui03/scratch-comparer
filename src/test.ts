import SB3Loader from './loader/sb3';
import LcsCodeComparer from './comparer/code_lcs';

let loader1 = new SB3Loader('./scm_r75.sb3');
let loader2 = new SB3Loader('./t2.sb3');
let comp = new LcsCodeComparer(loader1, loader2);
console.log(`Similarity: ${(comp.compare().similarity * 100).toFixed(4)}%`);
console.log('==========');
let comp4 = new LcsCodeComparer(loader2, loader1);
console.log(`Similarity: ${(comp4.compare().similarity * 100).toFixed(4)}%`);
console.log('==========');
let comp2 = new LcsCodeComparer(loader1, loader1);
console.log(`Similarity: ${(comp2.compare().similarity * 100).toFixed(4)}%`);
console.log('==========');
let comp3 = new LcsCodeComparer(loader2, loader2);
console.log(`Similarity: ${(comp3.compare().similarity * 100).toFixed(4)}%`);
console.log('==========');

// console.log(JSON.stringify(loader.getSyntaxTree(0)));

