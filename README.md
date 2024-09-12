# NL4DV: **N**atural **L**anguage toolkit **for** **D**ata **V**isualization
[![DOI:10.1109/TVCG.2020.3030418](https://zenodo.org/badge/DOI/10.1109/TVCG.2020.3030378.svg)](https://doi.org/10.1109/TVCG.2020.3030378)
[![arxiv badge](https://img.shields.io/badge/arXiv-2008.10723-red)](https://arxiv.org/abs/2008.10723)
[![arxiv badge](https://img.shields.io/badge/arXiv-2207.00189-%23B31B1B)](https://arxiv.org/abs/2207.00189)
[![PyPI license](https://img.shields.io/pypi/l/ansicolortags.svg)](https://pypi.python.org/pypi/nl4dv/)
![PyPI - Downloads](https://img.shields.io/pypi/dm/nl4dv)


**NL4DV** takes a **natural language query** about a given **dataset** as input and outputs a **structured JSON object** containing:
* Data attributes,
* Analytic tasks, and
* Visualizations (Vega-Lite specifications)

With this output, developers can
  - Create visualizations in Python using natural language, and/or
  - Add a natural language interface to their existing visualization systems.

![NL4DV Overview](https://raw.githubusercontent.com/nl4dv/nl4dv/master/overview.gif)

### Setup Instructions, API Documentation, and Examples
These can all be found on [NL4DV's project website](https://nl4dv.github.io/nl4dv/documentation.html).

### Credits
NL4DV was created by
<a target="_blank" href="https://www.cc.gatech.edu/~anarechania3">Arpit Narechania</a>, <a target="_blank" href="https://arjun010.github.io/">Arjun Srinivasan</a>, <a target="_blank"  href="https://www.linkedin.com/in/rmitra34/">Rishab Mitra</a>, <a href="https://va.gatech.edu/endert/">Alex Endert</a>, and <a href="https://www.cc.gatech.edu/~john.stasko/">John Stasko</a> of the <a target="_blank" href="http://vis.gatech.edu/">Georgia Tech Visualization Lab.</a> Along with <a target="_blank"  href="https://www.linkedin.com/in/subhamsah17/">Subham Sah</a>, and <a href="https://webpages.charlotte.edu/~wdou1/">Wenwen Dou</a> of the <a target="_blank" href="https://viscenter.charlotte.edu/">Ribarsky Center for Visual Analytics at UNC Charlotte.</a>

We thank the members of the <a target="_blank" href="http://vis.gatech.edu/">Georgia Tech Visualization Lab</a> for their support and constructive feedback.</p>

### Citations

#### 2021 IEEE TVCG Journal Full Paper (Proceedings of the 2020 IEEE VIS Conference)
```bibTeX
@article{narechania2021nl4dv,
  title = {{NL4DV}: A {Toolkit} for Generating {Analytic Specifications} for {Data Visualization} from {Natural Language} Queries},
  shorttitle = {{NL4DV}},
  author = {{Narechania}, Arpit and {Srinivasan}, Arjun and {Stasko}, John},
  journal = {IEEE Transactions on Visualization and Computer Graphics (TVCG)},
  doi = {10.1109/TVCG.2020.3030378},
  year = {2021},
  publisher = {IEEE}
}
```

#### 2022 IEEE VIS Conference Short Paper Track
```bibTeX
@inproceedings{mitra2022conversationalinteraction,
  title = {{Facilitating Conversational Interaction in Natural Language Interfaces for Visualization}},
  author = {{Mitra}, Rishab and {Narechania}, Arpit and {Endert}, Alex and {Stasko}, John},
  booktitle={2022 IEEE Visualization Conference (VIS)},
  url = {https://doi.org/10.48550/arXiv.2207.00189},
  doi = {10.48550/arXiv.2207.00189},
  year = {2022},
  publisher = {IEEE}
}
```

#### 2024 IEEE VIS NLVIZ workshop Paper
```bibTeX
@misc{sah2024nl4dvllm,
    title={Generating Analytic Specifications for Data Visualization from Natural Language Queries using Large Language Models}, 
    author={Subham Sah and Rishab Mitra and Arpit Narechania and Alex Endert and John Stasko and Wenwen Dou},
    year={2024},
    eprint={2408.13391},
    archivePrefix={arXiv},
    primaryClass={cs.HC},
    url={https://arxiv.org/abs/2408.13391}, 
    howpublished={Presented at the NLVIZ Workshop, IEEE VIS 2024}
}


```

### License
The software is available under the [MIT License](https://github.com/nl4dv/nl4dv/blob/master/LICENSE).

### Contact
If you have any questions, feel free to [open an issue](https://github.com/nl4dv/nl4dv/issues/new/choose) or contact [Arpit Narechania](http://narechania.com).
