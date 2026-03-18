module.exports = function remarkSlide() {
  return (tree) => {
    // inject an ES import so MDX modules have `SlideContainer` in scope
    tree.children.unshift({
      type: 'mdxjsEsm',
      value: "import SlideContainer from './SlideContainer'",
    });

    const slides = [];
    let current = [];

    for (const node of tree.children.slice()) {
      // skip injected mdxjsEsm import
      if (node && node.type === 'mdxjsEsm') continue;

      if (node && node.type === 'thematicBreak') {//---等价于 'thematicBreak'
        if (current.length > 0) {
          slides.push(current);
          current = [];
        }
      } else {
        current.push(node);
      }
    }

    if (current.length > 0) slides.push(current);

    const slideElements = slides.map(function (slide, index) {
      return {
        type: 'mdxJsxFlowElement',
        name: 'div',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'id',
            value: `slide-${String(index+1)}`,
          },
        ],
        children: slide,
      };
    });

    // replace remaining nodes (after the injected import) with SlideContainer
    tree.children = [tree.children[0]].concat([
      {
        type: 'mdxJsxFlowElement',
        name: 'SlideContainer',
        attributes: [],
        children: slideElements,
      },
    ]);
  };
};