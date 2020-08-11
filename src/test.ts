import SB3Loader from './loader/sb3';
import LcsCodeComparer from './comparer/code_lcs';

let loader1 = new SB3Loader('./scm_r75.sb3');
let loader2 = new SB3Loader('./osu! [Preview 0.1.0].sb3');
let comp = new LcsCodeComparer(loader1, loader2);
comp.compare();
console.log('==========');
let comp4 = new LcsCodeComparer(loader2, loader1);
comp4.compare();
console.log('==========');
let comp2 = new LcsCodeComparer(loader1, loader1);
comp2.compare();
console.log('==========');
let comp3 = new LcsCodeComparer(loader2, loader2);
comp3.compare();
console.log('==========');

// console.log(JSON.stringify(loader.getSyntaxTree(0)));

