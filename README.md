# NL4DV: **N**atural **L**anguage toolkit **for** **D**ata **V**isualization
[![DOI:10.1109/TVCG.2020.3030418](https://zenodo.org/badge/DOI/10.1109/TVCG.2020.3030378.svg)](https://doi.org/10.1109/TVCG.2020.3030378)
[![arxiv badge](https://img.shields.io/badge/arXiv-2008.10723-red)](https://arxiv.org/abs/2008.10723)
[![arxiv badge](https://img.shields.io/badge/arXiv-2207.00189-%23B31B1B)](https://arxiv.org/abs/2207.00189)
[![PyPI license](https://img.shields.io/pypi/l/ansicolortags.svg)](https://pypi.python.org/pypi/ansicolortags/)


**NL4DV** takes a **natural language query** about a given **dataset** as input and outputs a **structured JSON object** containing:
* Data attributes,
* Analytic tasks, and
* Visualizations (Vega-Lite specifications)

With this output, developers can
  - Create visualizations in Python using natural language, and/or
  - Add a natural language interface to their existing visualization systems.

<p>
    <b><u>IMPORTANT</u>:
    A new release with Conversational Interaction capabilities is Coming Soon on <a href="https://pypi.org/project/nl4dv/" target="_blank">PyPi</a>. Stay tuned!</b>
    <br/>
    Until then, you can locally build and install the toolkit from the <b><a href="https://github.com/nl4dv/nl4dv/tree/ci_review" target="_blank">ci_review</a></b> branch.
</p>


![NL4DV Overview](https://raw.githubusercontent.com/nl4dv/nl4dv/master/overview.gif)

### Setup Instructions, API Documentation, and Examples
These can all be found on [NL4DV's project website](https://nl4dv.github.io/nl4dv/documentation.html).

### Credits
NL4DV was created by
<a target="_blank" href="https://www.cc.gatech.edu/~anarechania3">Arpit Narechania</a>, <a target="_blank" href="https://arjun010.github.io/">Arjun Srinivasan</a>, <a target="_blank"  href="https://www.linkedin.com/in/rmitra34/">Rishab Mitra</a>, and <a href="https://www.cc.gatech.edu/~john.stasko/">John Stasko</a> of the <a target="_blank" href="http://vis.gatech.edu/">Georgia Tech Visualization Lab.</a>

We thank the members of the <a target="_blank" href="http://vis.gatech.edu/">Georgia Tech Visualization Lab</a> for their support and constructive feedback.</p>

##### Citation

```bibTeX
@article{narechania2020nl4dv,
  title = {{NL4DV}: A {Toolkit} for Generating {Analytic Specifications} for {Data Visualization} from {Natural Language} Queries},
  shorttitle = {{NL4DV}},
  author = {{Narechania}, Arpit and {Srinivasan}, Arjun and {Stasko}, John},
  journal = {IEEE Transactions on Visualization and Computer Graphics (TVCG)},
  doi = {10.1109/TVCG.2020.3030378},
  year = {2020},
  publisher = {IEEE}
}
```
```bibTeX
@misc{https://doi.org/10.48550/arxiv.2207.00189,
  doi = {10.48550/ARXIV.2207.00189},

  url = {https://arxiv.org/abs/2207.00189},

  author = {Mitra, Rishab and Narechania, Arpit and Endert, Alex and Stasko, John},

  keywords = {Human-Computer Interaction (cs.HC), FOS: Computer and information sciences, FOS: Computer and information sciences},

  title = {Facilitating Conversational Interaction in Natural Language Interfaces for Visualization},

  publisher = {arXiv},

  year = {2022},

  copyright = {arXiv.org perpetual, non-exclusive license}
}
```

### License
The software is available under the [MIT License](https://github.com/nl4dv/nl4dv/blob/master/LICENSE).

### Contact
If you have any questions, feel free to [open an issue](https://github.com/nl4dv/nl4dv/issues/new/choose) or contact [Arpit Narechania](https://www.cc.gatech.edu/~anarechania3).
