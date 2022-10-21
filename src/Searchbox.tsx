import { useState, useRef, useEffect } from "react";
import Products from "./Products";

export const Searchbox = (props: any) => {
  const firstRender = useRef<boolean>(true);
  const categorySet = new Set<string>();
  const colorsSet = new Set<string>();
  const colorDOM = useRef() as React.MutableRefObject<HTMLFormElement>;
  const categoryDOM = useRef() as React.MutableRefObject<HTMLSelectElement>;
  const minPriceDOM = useRef() as React.MutableRefObject<HTMLInputElement>;
  const maxPriceDOM = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [currentFiltered, setCurrentFiltered] = useState(props.DBListings);
  const [categoryArr, setCategoryArr] = useState<string[]>([]);
  const [colorsArr, setColorsArr] = useState<string[]>([]);

  const populateFilters = () => {
    for (const i in props.DBListings) {
      props.DBListings[i].node.categoryTags?.forEach((elem: string) =>
        categorySet.add(elem)
      );
      props.DBListings[i].node.colorFamily?.forEach((elem: { name: string }) =>
        colorsSet.add(elem.name)
      );
    }
    setCategoryArr(Array.from(categorySet));
    setColorsArr(Array.from(colorsSet));
    categorySet.clear();
    colorsSet.clear();
  };

  const filterDatabase = (
    color: string[],
    category: string,
    minPrice: string,
    maxPrice: string
  ) => {
    console.time("filtering database");
    let filterColor;
    // if no color is choosen
    if (color.length === 0) {
      filterColor = props.DBListings;
    } else {
      // if colors are choosen
      filterColor = props.DBListings.filter((entry: any) => {
        if (color.length === 1) {
          // one color is choosen
          if (entry.node.colorFamily !== null) {
            return entry.node.colorFamily[0].name === color[0];
          }
        } else if (color.length > 1) {
          // more than one color is choosen
          if (entry.node.colorFamily !== null) {
            if (color.length > 1 && entry.node.colorFamily.length > 1) {
              const productColors = entry.node.colorFamily.map(
                (color: any) => color.name
              );
              let checker = color.every((col) => productColors.includes(col));
              if (checker) return entry;
            }
          }
        }
      });
    }

    let filterCategory;
    if (category === "Category") {
      filterCategory = filterColor;
    } else {
      filterCategory = filterColor.filter((entry: any) => {
        if (entry.node.categoryTags !== null)
          return entry.node.categoryTags.includes(category);
      });
    }

    const filterPrice = filterCategory.filter((entry: any) => {
      return (
        entry.node.shopifyProductEu.variants.edges[0].node.price >= +minPrice &&
        entry.node.shopifyProductEu.variants.edges[0].node.price <= +maxPrice
      );
    });
    console.timeEnd("filtering database");
    return filterPrice;
  };

  // keep max currency value higher than minumum and in between its min and max range
  const matchMaxToMin = () => {
    if (
      +minPriceDOM.current.value >= +maxPriceDOM.current.value &&
      +maxPriceDOM.current.value <=
        +maxPriceDOM.current.max - +maxPriceDOM.current.step
    ) {
      maxPriceDOM.current.value = (
        +minPriceDOM.current.value + +maxPriceDOM.current.step
      ).toString();
    }
  };
  // keep min currency value lower than maximum and in between its min and max range
  const matchMinToMax = () => {
    if (
      +maxPriceDOM.current.value <= +minPriceDOM.current.value &&
      +minPriceDOM.current.value >=
        +minPriceDOM.current.min + +minPriceDOM.current.step
    ) {
      minPriceDOM.current.value = (
        +maxPriceDOM.current.value - +minPriceDOM.current.step
      ).toString();
    }
  };

  const updateSearchValues = () => {
    let color: string[] = [];
    colorDOM.current
      .querySelectorAll("input[type=checkbox]:checked")
      .forEach((check) => color.push(check.value));
    const category = categoryDOM.current.selectedOptions[0].value;
    const minPrice = minPriceDOM.current.value;
    const maxPrice = maxPriceDOM.current.value;
    const filteredDatabase: any = filterDatabase(
      color,
      category,
      minPrice,
      maxPrice
    );
    setCurrentFiltered(filteredDatabase);
  };

  useEffect(() => {
    if (firstRender.current) {
      console.time("lookup");
      populateFilters();
      console.timeEnd("lookup");
      firstRender.current = false;
    }
  });

  return (
    <>
      <form
        ref={colorDOM}
        title="colors"
        id="colors"
        onChange={updateSearchValues}
      >
        <>
          {colorsArr.map((color) => {
            return (
              <div key={color}>
                <input type="checkbox" value={color} id={color} />
                <label htmlFor={color}>{color}</label>
              </div>
              // {color}
              // </input>
            );
          })}
        </>
      </form>
      <select
        ref={categoryDOM}
        title="category"
        id="category"
        onChange={updateSearchValues}
      >
        <option value="Category">Category</option>
        <>
          {categoryArr.map((category) => {
            return <option key={category}>{category}</option>;
          })}
        </>
      </select>
      <input
        ref={minPriceDOM}
        type="number"
        min="0"
        max="1000"
        step="25"
        defaultValue="0"
        onChange={() => {
          updateSearchValues();
          matchMaxToMin();
        }}
      />
      <input
        ref={maxPriceDOM}
        type="number"
        min="0"
        max="1000"
        step="25"
        defaultValue="1000"
        onChange={() => {
          updateSearchValues();
          matchMinToMax();
        }}
      />
      <Products currentFiltered={currentFiltered} />
    </>
  );
};
