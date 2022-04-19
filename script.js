/*
	Cameron Samuels
	AP Computer Science Principles
	Create Performance Task
	Ms. Felicia Castillo
	March - April, 2022
*/

document.addEventListener("DOMContentLoaded", function() {


	// ==========
	// DOM Content
	// ==========
	var $ = function(x) {
		return document.querySelector(x);
	};
	var el = {
		textinput: $("#js-textinput"),
		output: $("#js-output>div")
	};


	// ==========
	// data storage
	// ==========
	var data1 = [];


	// ==========
	// collect data from various methods
	// ==========
	var collect = {};

	collect.textinput = function() {
		let text = el.textinput.value;
		if (text.includes(","))
			text = text.split(",");
		else
			text = text.split("\n");
		let nums = [];
		text.forEach(function(x) {
			let y = parseFloat(x);
			if (y) nums.push(y);
		});
		return nums;
	};
	el.textinput.addEventListener("input", function() {
		data1 = collect.textinput();
		localStorage.data1 = data1;
		display.refresh(data1);
	});


	// ==========
	// compute data with various calculations
	// ==========
	var compute = {};

	compute.copyDat = function(data) {
		let copyDat = [];
		data.forEach(function(x) {
			copyDat.push(x);
		});
		return copyDat;
	}

	compute.sum = function(data) {
		let tot = 0;
		data.forEach(function(x) {
			tot += x;
		});
		return tot;
	};

	compute.mean = function(data) {
		return compute.sum(data) / data.length;
	};

	compute.variance = function(data) {
		let mean = compute.mean(data);
		let devs = [];
		data.forEach(function(x) {
			devs.push(Math.pow(x - mean, 2));
		});
		return compute.sum(devs) / devs.length;
	};

	compute.stdev = function(data) {
		return Math.sqrt(compute.variance(data));
	};

	compute.median = function(data) {
		let copyDat = compute.copyDat(data);
		copyDat.sort();
		if (copyDat.length % 2 == 1) {
			let mid = Math.floor(copyDat.length / 2);
			return copyDat[mid];
		}
		else {
			let mid = Math.floor(copyDat.length / 2);
			let midSum = copyDat[mid - 1] + copyDat[mid];
			return midSum / 2;
		}
	};

	compute.q = function(data, q) {
		let n = data.length;
		let k = n % 2 == 1 ? n + 1 : n;
		let m = n % 2 == 1 ? n - 1 : n;
		let y = [];
		let start = q == 1 ? 0 : k / 2;
		let end = start + m/2;
		for (let i = start; i < end; i++)
			y.push(data[i]);
		return compute.median(y);
	};

	compute.min = function(data) {
		let min = data[0];
		data.forEach(function(x) {
			if (x < min)
				min = x;
		});
		return min;
	};

	compute.max = function(data) {
		let max = data[0];
		data.forEach(function(x) {
			if (x > max)
				max = x;
		});
		return max;
	};

	compute.fiveNumRaw = function(data) {
		return [
			compute.min(data),
			compute.q(data, 1),
			compute.median(data),
			compute.q(data, 3),
			compute.max(data)
		];
	}

	compute.fiveNum = function(data) {
		let fiveNum = compute.fiveNumRaw(data);
		return [
			["MIN", fiveNum[0]],
			["Q1", fiveNum[1]],
			["MED", fiveNum[2]],
			["Q3", fiveNum[3]],
			["MAX", fiveNum[4]]
		];
	}

	compute.count = function(data, y) {
		let num = 0;
		data.forEach(function(x) {
			if (x == y)
				num++;
		});
		return num;
	};

	compute.counts = function(data) {
		let counts = [];
		data.forEach(function(x) {
			let found = false;
			for (let i = 0; i < counts.length; i++) {
				if (counts[i][0] == x) {
					counts[i][1]++;
					found = true;
					break;
				}
			}
			if (!found) counts.push([x, 1]);
		});
		return counts;
	};

	compute.proportions = function(data) {
		let props = [];
		if (!data || !Array.isArray(data)) return;
		let counts = compute.counts(data);
		let n = 0;
		counts.forEach(function(x) {
			n += x[1];
		});
		counts.forEach(function(x) {
			let val = x[0];
			let count = x[1];
			props[val] = [val, count / n];
		});
		return props;
	};


	// ==========
	// check conditions
	// ==========
	var conditions = {};

	conditions.largecounts = function(n, props) {
		props.forEach(function(p) {
			if (n * p < 10)
				return false;
		});
		return true;
	};

	// TODO: other conditions, implementation in GUI



	// ==========
	// display computations
	// ==========
	var tables = {};

	tables.createCell = function(row, text) {
		let cell = row.insertCell();
		cell.textContent = text;
		return cell;
	};

	tables.createRow = function(table, values) {
		let row = table.insertRow();
		values.forEach(function(x) {
			tables.createCell(row, x);
		});
		return row;
	}

	tables.createHead = function(table, title) {
		let head = table.createTHead();
		tables.createRow(head, [title]);
		head.rows[0].cells[0].setAttribute("colspan", 2);
	}

	tables.createDataTable = function(data, title, cols) {
		let table = document.createElement("table");
		table.className = "js-datatable";
		tables.createHead(table, title);
		tables.createRow(table, cols);
		data.forEach(function(x) {
			tables.createRow(table, x);
		});
		return table;
	};


	var lists = {};

	lists.sortByCol = function(data, col) {
		let n = data.length;
		for (let i = 0; i < n; i++) {
			let min = i;
			for (let j = i + 1; j < n; j++)
				if (data[j][col] < data[min][col])
					min = j;
			if (min !== i) {
				let temp = data[i];
				data[i] = data[min];
				data[min] = temp;
			}
		}
		return data;
	};

	lists.round = function(data, dec, col) {
		let rounded = [];
		data.forEach(function(x) {
			if (col) {
				x[col] *= Math.pow(10, dec);
				x[col] = Math.round(x[col]);
				x[col] /= Math.pow(10, dec);
			} else {
				x *= Math.pow(10, dec);
				x = Math.round(x);
				x /= Math.pow(10, dec);
			}
			rounded.push(x);
		});
		return rounded;
	};


	var display = {};

	display.clear = function() {
		el.output.innerHTML = "";
	};

	display.fiveNum = function(data) {
		let fiveNum = compute.fiveNum(data);
		let table = tables.createDataTable(fiveNum,
			"Five Num Sum", ["Property", "Count"]);
		el.output.appendChild(table);
	};

	display.counts = function(data) {
		if (!data || data.length < 1) return;
		let counts = compute.counts(data);
		lists.sortByCol(counts, 0);
		let table = tables.createDataTable(counts,
			"Counts", ["Value", "Count"]);
		tables.createRow(table, ["Total", data.length]);
		el.output.appendChild(table);
	};

	display.proportions = function(data) {
		let props = compute.proportions(data);
		props = lists.round(props, 2, 1);
		let table = tables.createDataTable(props,
			"Proportions", ["Value", "Proportion"]);
		el.output.appendChild(table);
	};

	display.plot = function(data, type) {

		let counts = compute.counts(data);
		lists.sortByCol(counts, 0);

		let graph = document.createElement("div");
		graph.className = "js-" + type;

		let axis = document.createElement("span");
		graph.appendChild(axis);

		let min = counts[0][0];
		let max = counts[counts.length - 1][0];
		let xi = 0;
		for (let k = min; k <= max; k++) {
			let x = counts[xi];
			if (k == x[0]) {
				let pillar = document.createElement("div");
				for (let i = 0; i < x[1]; i++)
					pillar.appendChild(document.createElement("div"));
				graph.appendChild(pillar);
				xi++;
			} else {
				let pillar = document.createElement("div");
				pillar.className = "hidden";
				pillar.appendChild(document.createElement("div"));
				graph.appendChild(pillar);
			}
			let label = document.createElement("span");
			label.textContent = k;
			axis.appendChild(label);
		}
		el.output.appendChild(graph);

	};


	var graphs = {};
	graphs.createLabel = function(axis, x, y) {
		let label = document.createElement("span");
		label.textContent = y;
		label.style.left = (x - 2) + "px";
		axis.appendChild(label);
	}


	display.boxplot = function(data) {

		let fiveNum = compute.fiveNumRaw(data);
		for (let i = 1; i <= 3; i++)
			fiveNum[i] -= 1;

		let width = 300;
		let rw = (fiveNum[4] - fiveNum[0]) / width;
		let offset = 0 + 10 - 2;
		let q1Start = fiveNum[1] / rw + offset;
		let medPos = fiveNum[2] / rw + offset;
		let q3Start = (fiveNum[3] - fiveNum[1]) / rw;

		let graph = document.createElement("div");
		graph.className = "js-boxplot";

		let whiskers = document.createElement("div");
		whiskers.className = "js-boxplot-whiskers";
		graph.appendChild(whiskers);

		let box = document.createElement("div");
		box.className = "js-boxplot-box";
		box.style.left = q1Start + "px";
		box.style.width = q3Start + "px";
		graph.appendChild(box);
		
		let median = document.createElement("div");
		median.className = "js-boxplot-median";
		median.style.left = medPos + "px";
		graph.appendChild(median);

		let axis = document.createElement("span");
		graph.appendChild(axis);
		graphs.createLabel(axis, 0, fiveNum[0]);
		graphs.createLabel(axis, q1Start - offset, fiveNum[1] + 1);
		graphs.createLabel(axis, fiveNum[2] / rw, fiveNum[2] + 1);
		graphs.createLabel(axis, q1Start + q3Start, fiveNum[3] + 1);
		graphs.createLabel(axis, width, fiveNum[4]);
		
		el.output.appendChild(graph);

	};

	display.refresh = function(data) {
		display.clear();
		display.plot(data, "dotplot");
		display.plot(data, "barchart");
		display.boxplot(data);
		el.output.innerHTML += "<br>";
		display.counts(data);
		display.fiveNum(data);
		display.proportions(data);
	};


	// ==========
	// loading
	// ==========
	if (localStorage.data1) {
		el.textinput.value = localStorage.data1;
		data1 = collect.textinput();
		display.refresh(data1);
	}


});
