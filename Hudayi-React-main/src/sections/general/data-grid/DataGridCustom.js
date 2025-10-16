import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { 
  Stack, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination, 
  Paper, 
  Checkbox, 
  Button, 
  Menu, 
  MenuItem, 
  CircularProgress,
  alpha,
  Fade
} from '@mui/material';
import { useRouter } from 'next/router';

// Components
import { useLocales } from '../../../locales';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';

// Styled components with enhanced styling
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '16px',
  backgroundColor: '#ffffff',
  border: '1px solid rgba(230, 232, 240, 0.8)',
  boxShadow: '0 8px 16px 0 rgba(145, 158, 171, 0.08)',
  height: '100%',
  minHeight: '600px',
  overflow: 'auto',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 12px 24px 0 rgba(145, 158, 171, 0.12)',
  },
  // Enhanced scrollbar styling for webkit browsers
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(145, 158, 171, 0.3)',
    borderRadius: '10px',
    '&:hover': {
      background: 'rgba(145, 158, 171, 0.5)',
    },
  },
  // Firefox scrollbar styling
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(145, 158, 171, 0.3) rgba(0, 0, 0, 0.05)',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 11,
  backgroundColor: theme.palette.mode === 'light' ? '#F9FAFB' : theme.palette.background.paper,
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#F9FAFB' : theme.palette.background.paper,
  color: theme.palette.text.secondary,
  fontWeight: 600,
  fontSize: '0.875rem',
  padding: '16px',
  borderBottom: `1px solid ${theme.palette.divider}`,
  whiteSpace: 'nowrap',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  fontFamily: theme.typography.fontFamily,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? '#EAECF0' : alpha(theme.palette.background.paper, 0.12),
  },
}));

const StyledTableRow = styled(TableRow)(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: selected ? alpha(theme.palette.primary.lighter, 0.2) : 'inherit',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? alpha(theme.palette.primary.lighter, 0.12) : alpha(theme.palette.primary.darker, 0.12),
  },
  '&:last-child td, &:last-child th': {
    borderBottom: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '16px',
  fontSize: '0.875rem',
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
}));

const ToolbarButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  marginRight: theme.spacing(1.5),
  color: theme.palette.text.secondary,
  fontWeight: 500,
  borderRadius: '8px',
  padding: '6px 12px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
  },
}));

const StyledAddButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  boxShadow: '0 8px 16px 0 rgba(0, 171, 165, 0.24)',
  transition: 'all 0.2s ease',
  padding: '8px 16px',
  fontWeight: 600,
  '&:hover': {
    boxShadow: '0 12px 20px 0 rgba(0, 171, 165, 0.3)',
    transform: 'translateY(-2px)',
  },
}));

const CheckboxStyled = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? '#919EAB' : alpha(theme.palette.primary.main, 0.6),
  '&.Mui-checked': {
    color: '#07B7AD',
  },
  '&:hover': {
    backgroundColor: alpha('#07B7AD', 0.08),
  },
}));

const NoDataContainer = styled(Box)(({ theme }) => ({
  height: '400px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
  backgroundColor: alpha(theme.palette.background.paper, 0.4),
  borderRadius: '16px',
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  zIndex: 10,
  backdropFilter: 'blur(4px)',
}));

const StyledPagination = styled(TablePagination)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
    fontSize: '0.875rem',
  },
  '& .MuiTablePagination-select': {
    padding: '8px 12px',
    borderRadius: '8px',
    border: `1px solid ${theme.palette.divider}`,
  },
}));

// Custom table toolbar with filtering, column visibility, etc.
function CustomToolbar({ 
  columns, 
  visibleColumns, 
  setVisibleColumns, 
  filters, 
  setFilters,
  exportData,
  link,
  translate
}) {
  const { push } = useRouter();
  const [columnsMenuAnchor, setColumnsMenuAnchor] = useState(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [densityMenuAnchor, setDensityMenuAnchor] = useState(null);

  const handleColumnsClick = (event) => {
    setColumnsMenuAnchor(event.currentTarget);
  };

  const handleColumnsClose = () => {
    setColumnsMenuAnchor(null);
  };

  const handleFilterClick = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleDensityClick = (event) => {
    setDensityMenuAnchor(event.currentTarget);
  };

  const handleDensityClose = () => {
    setDensityMenuAnchor(null);
  };

  const toggleColumnVisibility = (field) => {
    setVisibleColumns(prev => {
      if (prev.includes(field)) {
        return prev.filter(col => col !== field);
      }
      // No else needed
      return [...prev, field];
    });
  };

  const exportToCsv = () => {
    if (exportData && exportData.length) {
      // Filter only visible columns
      const visibleColumnsData = columns.filter(col => visibleColumns.includes(col.field));
      
      const headers = visibleColumnsData.map(col => col.headerName).join(',');
      
      const rows = exportData.map(row => {
        return visibleColumnsData.map(col => {
          let value;
          
          // Use valueGetter if available
          if (col.valueGetter) {
            value = col.valueGetter({ row });
          } else {
            value = row[col.field];
          }
          
          // Apply valueFormatter if available
          if (col.valueFormatter && value !== undefined && value !== null) {
            value = col.valueFormatter({ value, row });
          }
          
          // Handle special cases for complex values
          if (typeof value === 'object' && value !== null) {
            // Handle cases like sessions/activities where value is {attended: x, total: y}
            if (value.attended !== undefined && value.total !== undefined) {
              value = `${value.attended}/${value.total}`;
            } else {
              value = JSON.stringify(value);
            }
          }
          
          // Handle null/undefined values
          if (value === null || value === undefined) {
            value = '';
          }
          
          // Convert to string and escape quotes for CSV
          value = String(value);
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          
          return value;
        }).join(',');
      }).join('\n');
  
      const csvContent = `${headers}\n${rows}`;
      
      // Add BOM (Byte Order Mark) for proper UTF-8 encoding in Excel
      const BOM = '\uFEFF';
      const csvWithBOM = BOM + csvContent;
      
      const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'data-export.csv');
      link.click();
      URL.revokeObjectURL(url); // Clean up the URL object
    }
  };

  return (
    <Stack 
      direction="row" 
      justifyContent="space-between" 
      alignItems="center" 
      width="100%" 
      px={3} 
      py={2}
      sx={{
        borderBottom: '1px solid rgba(230, 232, 240, 0.8)',
      }}
    >
      <Stack direction="row" spacing={1}>
        <ToolbarButton 
          onClick={handleColumnsClick} 
          startIcon={<Iconify icon="mdi:view-column" width={20} height={20} />}
          size="small"
        >
          {translate('toolbarColumns')}
        </ToolbarButton>
        <Menu
          anchorEl={columnsMenuAnchor}
          open={Boolean(columnsMenuAnchor)}
          onClose={handleColumnsClose}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 1.5,
              boxShadow: '0 8px 16px 0 rgba(145, 158, 171, 0.16)',
              borderRadius: '12px',
              width: 220,
            },
          }}
        >
          {columns.map((column) => (
            <MenuItem key={column.field} sx={{ py: 1 }}>
              <CheckboxStyled 
                checked={visibleColumns.includes(column.field)} 
                onChange={() => toggleColumnVisibility(column.field)}
                size="small"
              />
              <Typography variant="body2">{column.headerName}</Typography>
            </MenuItem>
          ))}
        </Menu>

         {/* <ToolbarButton 
          onClick={handleFilterClick} 
          startIcon={<Iconify icon="mdi:filter" width={20} height={20} />}
          size="small"
        >
          {translate('toolbarFilters')}
        </ToolbarButton>
        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={handleFilterClose}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 1.5,
              boxShadow: '0 8px 16px 0 rgba(145, 158, 171, 0.16)',
              borderRadius: '12px',
              width: 220,
            },
          }}
        >
          {columns.map((column) => (
            <MenuItem key={column.field} onClick={handleFilterClose} sx={{ py: 1 }}>
              <Typography variant="body2">{column.headerName}</Typography>
            </MenuItem>
          ))}
        </Menu>

        <ToolbarButton 
          onClick={handleDensityClick} 
          startIcon={<Iconify icon="mdi:format-line-spacing" width={20} height={20} />}
          size="small"
        >
          {translate('toolbarDensity')}
        </ToolbarButton>
        <Menu
          anchorEl={densityMenuAnchor}
          open={Boolean(densityMenuAnchor)}
          onClose={handleDensityClose}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 1.5,
              boxShadow: '0 8px 16px 0 rgba(145, 158, 171, 0.16)',
              borderRadius: '12px',
              width: 220,
            },
          }}
        >
          <MenuItem onClick={handleDensityClose} sx={{ py: 1 }}>
            <Typography variant="body2">{translate('toolbarDensityCompact')}</Typography>
          </MenuItem>
          <MenuItem onClick={handleDensityClose} sx={{ py: 1 }}>
            <Typography variant="body2">{translate('toolbarDensityStandard')}</Typography>
          </MenuItem>
          <MenuItem onClick={handleDensityClose} sx={{ py: 1 }}>
            <Typography variant="body2">{translate('toolbarDensityComfortable')}</Typography>
          </MenuItem>
        </Menu> */}

        <ToolbarButton 
          onClick={exportToCsv} 
          startIcon={<Iconify icon="mdi:download" width={20} height={20} />}
          size="small"
        >
          {translate('toolbarExport')}
        </ToolbarButton>
      </Stack>
      
      {link && (
        <StyledAddButton
          onClick={() => {
            push(link);
          }}
          startIcon={<Iconify icon="material-symbols:add" color="#ffffff" width={20} height={20} />}
          sx={{ 
            backgroundColor: '#07B7AD',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#069E94',
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {translate(`add_element`)}
          </Typography>
        </StyledAddButton>
      )}
    </Stack>
  );
}

// Custom no rows overlay with improved styling
function CustomNoRowsOverlay({ translate }) {
  return (
    <NoDataContainer>
      <Iconify 
        icon="mdi:table-empty" 
        width={60} 
        height={60} 
        sx={{ 
          opacity: 0.5,
          color: '#919EAB',
          mb: 2,
        }} 
      />
      <Typography 
        variant="subtitle1" 
        sx={{ 
          opacity: 0.7,
          fontWeight: 500,
          fontSize: '1rem',
        }}
      >
        {translate('noRowsLabel')}
      </Typography>
    </NoDataContainer>
  );
}

// Status renderer with enhanced styling
function RenderStatus({ getStatus }) {
  const { translate } = useLocales();
  
  let color = 'success';
  let label = translate('teachers.active_statues');
  let icon = 'mdi:check-circle';
  
  if (getStatus === '0' || getStatus === 0) {
    color = 'error';
    label = translate('teachers.inactive_statues');
    icon = 'mdi:close-circle';
  } else if (!getStatus) {
    return null;
  }
  
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Iconify icon={icon} width={18} height={18} sx={{ color: color === 'success' ? '#36B37E' : '#FF5630' }} />
      <Label 
        color={color} 
        variant="soft"
        sx={{ 
          py: 0.75,
          px: 1.5,
          borderRadius: '6px',
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      >
        {label}
      </Label>
    </Stack>
  );
}

// Main DataGrid component with improved styling
export default function CustomDataGrid({
  data = [],
  columns = [],
  link,
  isStyleNedded,
  pageSize = 15,
  page = 0,
  total,
  isPagination = true,
  onPageSizeChange,
  onPageChange,
  columnVisibilityModel,
  onRowClick,
  maxHeight,
}) {
  const { translate } = useLocales();
  const [selectionModel, setSelectionModel] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const { push } = useRouter();
  
  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const allColumnFields = columns.map(col => col.field);
    
    if (columnVisibilityModel) {
      return allColumnFields.filter(field => !columnVisibilityModel[field]);
    }
    
    return allColumnFields;
  });
  
  // Filter state
  const [filters, setFilters] = useState({});

  // Monitor data changes
  useEffect(() => {
    if (data && data.length > 0) {
      setLoading(false);
    }
  }, [data]);
  
  // Track external page changes
  useEffect(() => {
    setCurrentPage(page);
  }, [page]);
  
  // Track external pageSize changes
  useEffect(() => {
    setRowsPerPage(pageSize);
  }, [pageSize]);

  // Handle page change
  const handlePageChange = async (event, newPage) => {
    setLoading(true);
    setCurrentPage(newPage);
    
    if (onPageChange) {
      try {
        await onPageChange(newPage);
      } catch (error) {
        console.error("Error changing page:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const getBgColor = (index, isSelected) => {
    if (index === 0 || index === 2) {
      return isSelected ? '#ffffff' : '#ffffff';
    }
    return isSelected ? '#ffffff' : '#ffffff';
  };

  // Handle rows per page change
  const handleRowsPerPageChange = async (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    setLoading(true);
    setRowsPerPage(newPageSize);
    setCurrentPage(0);
    
    if (onPageSizeChange) {
      try {
        await onPageSizeChange(newPageSize);
      } catch (error) {
        console.error("Error changing page size:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  // Handle row click
  const handleRowClick = (event, row) => {
      console.log("Row clicked1:", row);
      console.log("Row clicked2:", event);
      onRowClick({"row":row, "event": event});
   
  };

  // Handle row selection
  const handleSelectRow = (id, event) => {
    if (event) {
      event.stopPropagation();
    }
     
    setSelectionModel(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      }
      // No else needed
      return [...prev, id];
    });
  };

  // Handle select all rows
  const handleSelectAllRows = (event) => {
    if (event.target.checked) {
      setSelectionModel(data.map(row => row.id));
    } else {
      setSelectionModel([]);
    }
  };

  // Render cell content based on column type
  const renderCellContent = (row, column) => {
    if (column.renderCell) {
      return column.renderCell({
        row,
        value: column.valueGetter ? column.valueGetter({ row }) : row[column.field],
        field: column.field
      });
    }
    
    let cellValue = row[column.field];
    if (column.valueGetter) {
      cellValue = column.valueGetter({ row });
    }
    
    if (column.valueFormatter && cellValue !== undefined) {
      cellValue = column.valueFormatter({ value: cellValue, row });
    }
    
    if (column.field === 'status') {
      return <RenderStatus getStatus={cellValue} />;
    }
    
    return cellValue;
  };

  // Calculate visible data
  const visibleData = useMemo(() => {
    return data;
  }, [data, currentPage, rowsPerPage, isPagination]);

  return (
    <Box 
      sx={{ 
        width: '100%',
        position: 'relative',
        height: '100%',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          ...(isStyleNedded == null
            ? {
                borderRadius: '16px',
                backgroundColor: 'white',
                border: '1px solid rgba(230, 232, 240, 0.8)',
                boxShadow: '0 8px 16px 0 rgba(145, 158, 171, 0.08)',
              }
            : {}),
        }}
      >
        <CustomToolbar
          columns={columns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          filters={filters}
          setFilters={setFilters}
          exportData={data}
          link={link}
          translate={translate}
        />
        
        <Box sx={{ 
          position: 'relative', 
          flex: 1,
          height: maxHeight || 'calc(100% - 64px)',
          maxHeight: maxHeight || undefined,
        }}>
          {isLoading && (
            <Fade in={isLoading}>
              <LoadingOverlay>
                <CircularProgress 
                  size={40} 
                  thickness={4} 
                  sx={{ color: '#07B7AD' }} 
                />
              </LoadingOverlay>
            </Fade>
          )}
          
          <StyledTableContainer>
            {(!data || data.length === 0) && !isLoading ? (
              <CustomNoRowsOverlay translate={translate} />
            ) : (
              <Table stickyHeader aria-label="custom data grid">
                <StyledTableHead>
                  <TableRow>
                    <StyledHeaderCell padding="checkbox" width={50} sx={{ position: 'sticky', left: 0, zIndex: 3 }}>
                      <CheckboxStyled
                        indeterminate={selectionModel.length > 0 && selectionModel.length < data.length}
                        checked={selectionModel.length === data.length && data.length > 0}
                        onChange={handleSelectAllRows}
                        size="small"
                      />
                    </StyledHeaderCell>
                    {columns
                      .filter(column => visibleColumns.includes(column.field))
                      .map((column, index) => (
                        <StyledHeaderCell 
                          key={column.field}
                          align={column.align || 'left'}
                          style={{ 
                            minWidth: column.minWidth || 120,
                            maxWidth: column.maxWidth,
                            width: column.width,
                          }}
                          sx={{
                            position: index === 0 || index === 2? 'sticky' : 'static',
                            left: index === 0 ? 50 : index === 2? 160 : 'auto',
                            zIndex: index === 0  || index === 2? 2 : 1,
                          }}
                        >
                          {column.headerName}
                        </StyledHeaderCell>
                      ))}
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {visibleData.length > 0 ? (
                    visibleData.map((row) => {
                      const isSelected = selectionModel.includes(row.id);
                      return (
                        <StyledTableRow
                          hover
                          key={row.id || `row-${Math.random()}`}
                          onClick={(event) => handleRowClick(event, row)}
                          selected={isSelected}
                        >
                          <StyledTableCell 
                            padding="checkbox" 
                            width={50}
                            sx={{ 
                              position: 'sticky', 
                              left: 0, 
                              zIndex: 1,
                              backgroundColor: isSelected 
                                ? alpha('#f5f5f5', 0.9)
                                : '#ffffff',
                              '&:hover': {
                                backgroundColor: isSelected 
                                  ? alpha('#f5f5f5', 0.9)
                                  : '#ffffff',
                              }
                            }}
                          >
                            <CheckboxStyled
                              checked={isSelected}
                              onClick={(e) => handleSelectRow(row.id, e)}
                              size="small"
                            />
                          </StyledTableCell>
                          {columns
                            .filter(column => visibleColumns.includes(column.field))
                            .map((column, index) => (
                              <StyledTableCell 
                                key={`${row.id || Math.random()}-${column.field}`} 
                                align={column.align || 'left'}
                                sx={{
                                  minWidth: column.minWidth,
                                  maxWidth: column.maxWidth,
                                  width: column.width,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  position: index === 0 || index === 2? 'sticky' : 'static',
                                  left: index === 0 ? 50 : index === 2? 160 : 'auto',
                                  zIndex: index === 0  || index === 2? 5 : 1,
                                  // Extract the backgroundColor logic to a variable
                                  backgroundColor: getBgColor(index, isSelected),
                                  '&:hover': {
                                    backgroundColor: 'inherit',
                                  }
                                }}
                              >
                                {renderCellContent(row, column)}
                              </StyledTableCell>
                            ))}
                        </StyledTableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} align="center">
                        <Typography variant="body2">No data to display</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </StyledTableContainer>
        </Box>
        
        {isPagination && (
          <StyledPagination
            rowsPerPageOptions={[15, 25, 50, 100, 500, 1000, 5000]}
            component="div"
            count={total || data.length}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            sx={{
              borderTop: '1px solid rgba(230, 232, 240, 0.8)',
            }}
          />
        )}
      </Paper>
    </Box>
  );
}

// PropTypes
CustomDataGrid.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  link: PropTypes.string,
  isStyleNedded: PropTypes.bool,
  pageSize: PropTypes.number,
  page: PropTypes.number,
  total: PropTypes.number,
  isPagination: PropTypes.bool,
  onPageSizeChange: PropTypes.func,
  onPageChange: PropTypes.func,
  columnVisibilityModel: PropTypes.object,
  onRowClick: PropTypes.func,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

CustomToolbar.propTypes = {
  columns: PropTypes.array.isRequired,
  visibleColumns: PropTypes.array.isRequired,
  setVisibleColumns: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  exportData: PropTypes.array,
  link: PropTypes.string,
  translate: PropTypes.func.isRequired,
};

CustomNoRowsOverlay.propTypes = {
  translate: PropTypes.func.isRequired,
};

RenderStatus.propTypes = {
  getStatus: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};