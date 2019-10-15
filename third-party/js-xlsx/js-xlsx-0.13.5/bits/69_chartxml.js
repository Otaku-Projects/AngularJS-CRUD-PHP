function parse_numCache(data/*:string*/)/*:[Array<number>, string]*/ {
	var col/*:Array<number>*/ = [];

	/* 21.2.2.150 pt CT_NumVal */
	(data.match(/<c:pt idx="(\d*)">(.*?)<\/c:pt>/mg)||[]).forEach(function(pt) {
		var q = pt.match(/<c:pt idx="(\d*?)"><c:v>(.*)<\/c:v><\/c:pt>/);
		if(!q) return;
		col[+q[1]] = +q[2];
	});

	/* 21.2.2.71 formatCode CT_Xstring */
	var nf = unescapexml((data.match(/<c:formatCode>([\s\S]*?)<\/c:formatCode>/) || ["","General"])[1]);

	return [col, nf];
}

/* 21.2 DrawingML - Charts */
function parse_chart(data/*:?string*/, name/*:string*/, opts, rels, wb, csheet) {
	var cs/*:Worksheet*/ = ((csheet || {"!type":"chart"})/*:any*/);
	if(!data) return csheet;
	/* 21.2.2.27 chart CT_Chart */

	var C = 0, R = 0, col = "A";
	var refguess = {s: {r:2000000, c:2000000}, e: {r:0, c:0} };

	/* 21.2.2.120 numCache CT_NumData */
	(data.match(/<c:numCache>[\s\S]*?<\/c:numCache>/gm)||[]).forEach(function(nc) {
		var cache = parse_numCache(nc);
		refguess.s.r = refguess.s.c = 0;
		refguess.e.c = C;
		col = encode_col(C);
		cache[0].forEach(function(n,i) {
			cs[col + encode_row(i)] = {t:'n', v:n, z:cache[1] };
			R = i;
		});
		if(refguess.e.r < R) refguess.e.r = R;
		++C;
	});
	if(C > 0) cs["!ref"] = encode_range(refguess);
	return cs;
}
