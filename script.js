'use strict';

var treeData = [
	{
		'name': 'Top Level',
		'parent': 'null',
		'children': [
			{
				'name': 'Level 2: A',
				'parent': 'Top Level',
				'children': [
					{
						'name': 'Son of A',
						'parent': 'Level 2: A',
						'children': [
							{
								'name': 'Son of son of A',
								'parent': 'Level 3: A'
							},
							{
								'name': 'Daughter of son of A',
								'parent': 'Level 3: A'
							}
						]
					},
					{
						'name': 'Daughter of A',
						'parent': 'Level 2: A'
					}
				]
			},
			{
				'name': 'Level 2: B',
				'parent': 'Top Level'
			}
		]
	}
];

// ************** Generate the tree diagram	 *****************
var margin = { top: 40, right: 120, bottom: 20, left: 120 },
	width = 960 - margin.right - margin.left,
	height = 500 - margin.top - margin.bottom;

var i = 0;

var tree = d3.layout.tree()
	.size([height, width]);

var diagonal = d3.svg.diagonal()
	.projection(function(d) {
		return [d.x, d.y];
	});

var svg = d3.select('body').append('svg')
	.attr('width', width + margin.right + margin.left)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var root = treeData[0];
var maxDepth = 0;
update();

function update() {

	// Compute the new tree layout.
	var nodes = tree.nodes(root).reverse(),
		links = tree.links(nodes);

	// Normalize for fixed-depth.
	nodes.forEach(function(d) {
		//get max depth
		if (maxDepth < d.depth) {
			maxDepth = d.depth;
		}
		d.y = d.depth * 100;
	});

	// Declare the nodes…
	var node = svg.selectAll('g.node')
		.data(nodes, function(d) {
			return d.id || (d.id = ++i);
		});

	// Enter the nodes.
	var nodeEnter = node.enter().append('g')
		.attr('data-id', function(d) {
			return d.id;
		})
		.attr('data-parent-id', function(d) {
			return d.parent.id;
		})
		.attr('class', function(d) {
			return (d.depth == 0 ? 'node' : 'node hidden');
		})
		.attr('transform', function(d) {
			return 'translate(' + d.x + ',' + d.y + ')';
		});

	nodeEnter.append('circle')
		.attr('r', 10)
		.style('fill', '#ccc');

	nodeEnter.append('text')
		.attr('y', function(d) {
			return d.children || d._children ? -18 : 18;
		})
		.attr('dy', '.35em')
		.attr('text-anchor', 'middle')
		.text(function(d) {
			return d.name; })
		.style('fill-opacity', 1);

	// Declare the links…
	var link = svg.selectAll('path.link')
		.data(links, function(d) {
			return d.target.id;
		});

	// Enter the links.
	link.enter().insert('path', 'g')
		.attr('data-link-id', function(d) {
			return d.target.parent.id;
		})
		.attr('class', 'link hidden')
		.attr('d', diagonal);

	node.on('click', function() {
		var $this = $(this),
			id = $this.data('id');

		if ($this.hasClass('expanded')) {
			hideChildren(id);
		} else {
			$('.node[data-parent-id=' + id + ']').toggleClass('hidden');
			$('path[data-link-id=' + id + ']').toggleClass('hidden');
		}

		$this.toggleClass('expanded');
	});

}

function hideChildren(id) {
	for (var i = 0; i < maxDepth; i++) {
		$('.node[data-parent-id=' + (id - i) + ']').addClass('hidden').removeClass('expanded');
		$('path[data-link-id=' + (id - i) + ']').addClass('hidden');
	}
}

