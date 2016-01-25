import React from 'react';

const NUMBER_PLACEHOLDER_REGEX = /\{\s*number\s*\}/;

function pageHref(num) {
    return `#page-${num + 1}`
}

export class Paginator extends React.Component {
    handlePrevious(e) {
        e.preventDefault()
        this.props.onPageChange(this.props.currentPage - 1)
    }

    handleNext(e) {
        e.preventDefault()
        this.props.onPageChange(this.props.currentPage + 1);
    }

    handlePageButton(page, e) {
        e.preventDefault();
        this.props.onPageChange(page);
    }

    renderPrevious(label) {
        if (this.props.currentPage < 1) {
            return <li className="pagination-previous disabled" key="prev">
                { label }
            </li>
        } else {
            return <li className="pagination-previous" key="prev">
                <a href={pageHref(this.props.currentPage - 1)}
                   aria-label="Previous page"
                   onClick={this.handlePrevious.bind(this)}>
                    { label }
                </a>
            </li>
        }
    }

    renderNext(label) {
        if (!(this.props.currentPage < this.props.numPages - 1)) {
            return <li className="pagination-next disabled" key="next">
                { label }
            </li>
        } else {
            return <li className="pagination-next" key="next">
                <a href={pageHref(this.props.currentPage + 1)}
                   aria-label="Next page"
                   key="next"
                   onClick={this.handleNext.bind(this)}>
                    { label }
                </a>
            </li>
        }
    }

    renderPageButton(isCurrent, pageNum) {
        const label = this.props.pageLabel.replace(NUMBER_PLACEHOLDER_REGEX, pageNum + 1);

        if (isCurrent) {
            return <li className="current" key={pageNum}>{pageNum + 1}</li>
        } else {
            return <li key={pageNum}>
                <a href={pageHref(pageNum)}
                   aria-label={label}
                   onClick={this.handlePageButton.bind(this, pageNum)}>
                    {pageNum + 1}
                </a>
            </li>
        }

    }

    render() {
        if (typeof this.props.colSpan === 'undefined') {
            throw new TypeError('Must pass a colSpan argument to Paginator');
        }

        if (typeof this.props.numPages === 'undefined') {
            throw new TypeError('Must pass a non-zero numPages argument to Paginator');
        }

        if (typeof this.props.currentPage === 'undefined') {
            throw new TypeError('Must pass a currentPage argument to Paginator');
        }

        let pageButtons = [];
        let pageButtonLimit = this.props.pageButtonLimit;
        let currentPage = this.props.currentPage;
        let numPages = this.props.numPages;
        let lowerHalf = Math.round( pageButtonLimit / 2 );
        let upperHalf = (pageButtonLimit - lowerHalf);

        for (let i = 0; i < this.props.numPages; i++) {
            let pageNum = i;
            pageButtons.push( this.renderPageButton((currentPage === i), pageNum));
        }

        if(currentPage - pageButtonLimit + lowerHalf > 0) {
            if(currentPage > numPages - lowerHalf) {
                pageButtons.splice(0, numPages - pageButtonLimit)
            } else {
                pageButtons.splice(0, currentPage - pageButtonLimit + lowerHalf);
            }
        }

        if((numPages - currentPage) > upperHalf) {
            pageButtons.splice(pageButtonLimit, pageButtons.length - pageButtonLimit);
        }

        return (
            <tbody className="reactable-pagination">
                <tr>
                    <td colSpan={this.props.colSpan}>
                        <ul className="pagination text-center" role="navigation" aria-label="Pagination">
                            {this.renderPrevious(this.props.prevLabel)}
                            {pageButtons}
                            {this.renderNext(this.props.nextLabel)}
                        </ul>
                    </td>
                </tr>
            </tbody>
        );
    }
};

