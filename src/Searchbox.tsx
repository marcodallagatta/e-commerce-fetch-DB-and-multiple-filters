import { useState, useRef, useEffect } from "react";

export const Searchbar = (props: any) => {
  const firstRender = useRef<boolean>(true);
  const categorySet = new Set<string>();
  const colorsSet = new Set<string>();
  const colorDOM = useRef() as React.MutableRefObject<HTMLSelectElement>;
  const categoryDOM = useRef() as React.MutableRefObject<HTMLSelectElement>;
  const minPriceDOM = useRef() as React.MutableRefObject<HTMLInputElement>;
  const maxPriceDOM = useRef() as React.MutableRefObject<HTMLInputElement>;
  const resultsDOM = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [categoryArr, setCategoryArr] = useState<string[]>([]);
  const [colorsArr, setColorsArr] = useState<string[]>([]);

  const populateFilters = () => {
    for (const i in props.DBListings) {
      props.DBListings[i].node.categoryTags?.forEach((elem: string) => categorySet.add(elem));
      props.DBListings[i].node.colorFamily?.forEach((elem: { name: string }) => colorsSet.add(elem.name));
    }
    setCategoryArr(Array.from(categorySet));
    setColorsArr(Array.from(colorsSet));
    categorySet.clear();
    colorsSet.clear();
  };

  const filterDatabase = (color: string, category: string, minPrice: string, maxPrice: string) => {
    console.log(color, category);

    let filterColor;
    if (color === "Color") {
      filterColor = props.DBListings;
    } else {
      filterColor = props.DBListings.filter((entry: any) => {
        if (entry.node.colorFamily !== null) return entry.node.colorFamily[0].name === color;
      });
    }

    let filterCategory;
    if (filterCategory === "Category") {
      filterCategory = filterColor;
    } else {
      filterCategory = filterColor.filter((entry: any) => {
        return entry.node.categoryTags.includes(category);
      });
    }

    const filterPrice = filterCategory.filter((entry: any) => {
      return entry.node.shopifyProductEu.variants.edges[0].node.price >= minPrice && entry.node.shopifyProductEu.variants.edges[0].node.price <= maxPrice;
    });
    console.log(filterPrice);
    return filterPrice.length > 0 ? "ok!" : "There are no product matching all the selected filters, please try a less narrow search.";
  };

  const updateSearchValues = () => {
    console.time("updateSearchValues");
    const color = colorDOM.current.selectedOptions[0].value;
    const category = categoryDOM.current.selectedOptions[0].value;
    const minPrice = minPriceDOM.current.value;
    const maxPrice = maxPriceDOM.current.value;
    console.timeEnd("updateSearchValues");
    console.time("filterDatabase");
    const filteredDatabase = filterDatabase(color, category, minPrice, maxPrice);
    console.timeEnd("filterDatabase");
    resultsDOM.current.textContent = filteredDatabase;
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
      <select
        ref={colorDOM}
        title="colors"
        id="colors"
        onChange={updateSearchValues}>
        <option value="Color">Any Color</option>
        <>
          {colorsArr.map((color) => {
            return (
              <option
                value={color}
                key={color}>
                {color}
              </option>
            );
          })}
        </>
      </select>
      <select
        ref={categoryDOM}
        title="category"
        id="category"
        onChange={updateSearchValues}>
        <option value="Category">Any Category</option>
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
        max="200"
        step="5"
        defaultValue="0"
        onChange={updateSearchValues}
      />
      <input
        ref={maxPriceDOM}
        type="number"
        min="50"
        max="1000"
        step="20"
        defaultValue="1000"
        onChange={updateSearchValues}
      />
      <div
        className="results"
        ref={resultsDOM}>
        ciao
      </div>
    </>
  );
};

// We need to have the possibility to filter
// a. Color(color family name)
// b. Price(price range between x and x)
// c. Category tags(for example sandals, mid-heels, etc)
// 2. Use Next, Gatsby or CRA (if you want to impress? use our current stack)
// 3. Use pagination so not all products are loaded at once
// 4. All the filters need to accept multiple parameters
// 5. The user should be able to combine the filter parameters together
